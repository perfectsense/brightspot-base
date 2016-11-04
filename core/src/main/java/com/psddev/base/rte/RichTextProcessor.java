package com.psddev.base.rte;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.DataNode;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.parser.Tag;

import com.psddev.cms.db.RichTextElement;
import com.psddev.cms.db.ToolUi;
import com.psddev.dari.db.ObjectType;
import com.psddev.dari.db.Reference;
import com.psddev.dari.db.ReferentialText;

public final class RichTextProcessor {

    private static final Tag BR_TAG = Tag.valueOf("br");
    private static final Tag DIV_TAG = Tag.valueOf("div");

    public static final String RICH_TEXT_ELEMENT_VIEW_TYPE = "rte";

    @FunctionalInterface
    public interface HtmlViewFunction extends Function<String, Object> {
    }

    @FunctionalInterface
    public interface RichTextElementViewFunction extends Function<RichTextElement, Object> {
    }

    @FunctionalInterface
    public interface HtmlElementWrapperViewFunction extends BiFunction<HtmlElement, List<Object>, Object> {
    }

    @FunctionalInterface
    public interface RichTextProcessorFunction extends Function<String, String> {
    }

    public static final class HtmlElement {

        private String tagName;

        private Map<String, String> attributes;

        private HtmlElement(Element element) {
            this.tagName = element.tagName();
            this.attributes = element.attributes().asList()
                .stream()
                .collect(Collectors.toMap(Attribute::getKey, Attribute::getValue));
        }

        public String getTagName() {
            return tagName;
        }

        public Map<String, String> getAttributes() {
            return attributes;
        }
    }

    private Collection<?> richText;

    private HtmlViewFunction htmlViewFunction;

    private RichTextElementViewFunction richTextElementViewFunction;

    private HtmlElementWrapperViewFunction htmlElementWrapperViewFunction;

    private boolean renderUnhandledRichTextElements;

    private List<RichTextProcessorFunction> richTextProcessorFunctions = new ArrayList<>();

    public RichTextProcessor(String... richText) {
        this.richText = Arrays.asList(richText);
    }

    public RichTextProcessor(Collection<String> richText) {
        this.richText = richText;
    }

    public RichTextProcessor(ReferentialText referentialText) {
        this.richText = referentialText;
    }

    public RichTextProcessor htmlViewFunction(HtmlViewFunction htmlViewFunction) {
        this.htmlViewFunction = htmlViewFunction;
        return this;
    }

    public RichTextProcessor richTextElementViewFunction(RichTextElementViewFunction richTextElementViewFunction) {
        this.richTextElementViewFunction = richTextElementViewFunction;
        return this;
    }

    public RichTextProcessor htmlElementWrapperViewFunction(HtmlElementWrapperViewFunction htmlElementWrapperViewFunction) {
        this.htmlElementWrapperViewFunction = htmlElementWrapperViewFunction;
        return this;
    }

    public RichTextProcessor renderUnhandledRichTextElements(boolean renderUnhandledRichTextElements) {
        this.renderUnhandledRichTextElements = renderUnhandledRichTextElements;
        return this;
    }

    public RichTextProcessor addRichTextProcessorFunction(RichTextProcessorFunction richTextProcessorFunction) {
        if (richTextProcessorFunction != null) {
            this.richTextProcessorFunctions.add(richTextProcessorFunction);
        }
        return this;
    }

    public static RichTextProcessor createDefault(String... richText) {
        return new RichTextProcessor(richText)
            .addRichTextProcessorFunction(new EditorialMarkupProcessor())
            .addRichTextProcessorFunction(new LineBreakProcessor());
    }

    public static RichTextProcessor createDefault(Collection<String> richText) {
        return new RichTextProcessor(richText)
            .addRichTextProcessorFunction(new EditorialMarkupProcessor())
            .addRichTextProcessorFunction(new LineBreakProcessor());
    }

    public static RichTextProcessor createDefault(ReferentialText referentialText) {
        return new RichTextProcessor(referentialText)
            .addRichTextProcessorFunction(new EditorialMarkupProcessor())
            .addRichTextProcessorFunction(new LineBreakProcessor());
    }

    private static Map<String, ObjectType> getRteTagTypes() {
        return ObjectType.getInstance(RichTextElement.class)
            .findConcreteTypes()
            .stream()
            .collect(Collectors.toMap(
                type -> type.as(ToolUi.class).getRichTextElementTagName(),
                Function.identity()));
    }

    private static String getRteTagsDomSelector() {
        String selector = getRteTagTypes().keySet().stream().map(tag -> tag.replace(":", "|")).collect(Collectors.joining(","));
        if (selector.isEmpty()) {
            selector = null;
        }
        return selector;
    }

    public List<Object> build() {

        List<Object> views = new ArrayList<>();

        Map<String, ObjectType> tagTypes = getRteTagTypes();

        if (richText != null) {

            for (Object item : richText) {

                if (item instanceof String) {

                    String html = (String) item;

                    Document document = Jsoup.parseBodyFragment(html);
                    document.outputSettings().prettyPrint(false);

                    html = document.body().html();

                    for (RichTextProcessorFunction function : richTextProcessorFunctions) {
                        String updatedHtml = function.apply(html);
                        if (updatedHtml != null) {
                            html = updatedHtml;
                        }
                    }

                    document = Jsoup.parseBodyFragment(html);
                    document.outputSettings().prettyPrint(false);

                    toRteNodes(document.body().childNodes(), tagTypes)
                        .stream()
                        .map(RteNode::toViews)
                        .flatMap(Collection::stream)
                        .forEach(views::add);

                } else if (item instanceof Reference && referenceViewFunction != null) {

                    Object referenceView = referenceViewFunction.apply((Reference) item);
                    if (referenceView != null) {
                        views.add(referenceView);
                    }
                }
            }
        }

        return views;
    }

    public <T> T build(Function<List<Object>, T> viewListFunction) {
        return viewListFunction.apply(build());
    }

    /*
     * Traverses the siblings all the way down the tree, collapsing balanced
     * blocks of HTML that do NOT contain any rich text elements into a single
     * HTML String. If a non-rich text element is found and NONE of its
     * descendants are rich text elements, then it will be collapsed into a
     * String. If ANY of its descendants DO contain a rich text element then
     * each parent of the rich text element will remain an Element object and
     * not be collapsed into a String UNLESS there is no htmlElementWrapperViewFunction
     * defined in which case the element will be converted into a potentially
     * unbalanced HTML String.
     */
    private List<RteNode> toRteNodes(List<Node> siblings, Map<String, ObjectType> tagTypes) {

        List<RteNode> rteNodes = new ArrayList<>();

        for (Node sibling : siblings) {

            if (sibling instanceof Element) {

                Element element = (Element) sibling;
                String tagName = element.tagName();

                ObjectType tagType = tagTypes.get(tagName);

                if (tagType != null && richTextElementViewFunction != null) {

                    RichTextElement rte = (RichTextElement) tagType.createObject(null);

                    rte.fromAttributes(StreamSupport.stream(element.attributes().spliterator(), false)
                        .collect(Collectors.toMap(Attribute::getKey, Attribute::getValue)));

                    rte.fromBody(element.html());

                    rteNodes.add(new RteRichTextElement(rte));

                } else if (tagType == null || renderUnhandledRichTextElements) {

                    List<RteNode> childRteNodes = toRteNodes(element.childNodes(), tagTypes);

                    if (htmlElementWrapperViewFunction != null
                        && childRteNodes.stream().filter(rteNode -> !(rteNode instanceof RteHtml)).count() > 0) {

                        // preserve the RteElement, and collapse children as much as possible
                        rteNodes.add(new RteElement(element, childRteNodes));

                    } else {
                        String elementHtml = element.outerHtml();

                        if (element.tag().isSelfClosing()) {
                            rteNodes.add(new RteHtml(elementHtml));

                        } else {
                            int firstGtAt = elementHtml.indexOf('>');
                            int lastLtAt = elementHtml.lastIndexOf('<');

                            // deliberately do not validate the index values
                            // above since they should always be valid. If it
                            // turns out there's an edge case where they aren't,
                            // a RuntimeException will be thrown and we can
                            // re-evaluate from there.

                            rteNodes.add(new RteHtml(elementHtml.substring(0, firstGtAt + 1)));
                            rteNodes.addAll(childRteNodes);
                            rteNodes.add(new RteHtml(elementHtml.substring(lastLtAt)));
                        }
                    }
                }

            } else if (sibling instanceof TextNode || sibling instanceof DataNode) {

                if (sibling instanceof TextNode) {
                    rteNodes.add(new RteHtml(((TextNode) sibling).text()));

                } else {
                    rteNodes.add(new RteHtml(((DataNode) sibling).getWholeData()));
                }
            }
        }

        // collapse the nodes as much as possible
        return collapseRteNodes(rteNodes);
    }

    private List<RteNode> collapseRteNodes(List<RteNode> rteNodes) {

        List<RteNode> collapsedRteNodes = new ArrayList<>();

        List<RteHtml> adjacentHtmlNodes = new ArrayList<>();

        for (RteNode childRteNode : rteNodes) {

            if (childRteNode instanceof RteHtml) {
                adjacentHtmlNodes.add((RteHtml) childRteNode);

            } else {
                collapsedRteNodes.add(new RteHtml(
                    adjacentHtmlNodes.stream()
                        .map(rteHtml -> rteHtml.html)
                        .collect(Collectors.joining(""))));

                adjacentHtmlNodes.clear();

                collapsedRteNodes.add(childRteNode);
            }
        }

        if (!adjacentHtmlNodes.isEmpty()) {
            collapsedRteNodes.add(new RteHtml(
                adjacentHtmlNodes.stream()
                    .map(rteHtml -> rteHtml.html)
                    .collect(Collectors.joining(""))));
        }

        return collapsedRteNodes;
    }

    private interface RteNode {

        List<Object> toViews();
    }

    private class RteHtml implements RteNode {

        private String html;

        RteHtml(String html) {
            this.html = html;
        }

        @Override
        public List<Object> toViews() {
            Object view;
            if (htmlViewFunction != null) {
                view = htmlViewFunction.apply(html);
            } else {
                view = html;
            }
            return view != null ? Collections.singletonList(view) : Collections.emptyList();
        }
    }

    private class RteElement implements RteNode {

        private Element element;

        private List<RteNode> children = new ArrayList<>();

        RteElement(Element element, List<RteNode> children) {
            this.element = element;
            this.children = children;
        }

        @Override
        public List<Object> toViews() {
            if (htmlElementWrapperViewFunction != null) {
                Object view = htmlElementWrapperViewFunction.apply(new HtmlElement(element),
                    children.stream()
                        .map(RteNode::toViews)
                        .flatMap(Collection::stream)
                        .collect(Collectors.toList()));

                return view != null ? Collections.singletonList(view) : Collections.emptyList();

            } else {
                return Collections.emptyList();
            }
        }
    }

    private class RteRichTextElement implements RteNode {

        private RichTextElement richTextElement;

        RteRichTextElement(RichTextElement richTextElement) {
            this.richTextElement = richTextElement;
        }

        @Override
        public List<Object> toViews() {
            Object view = null;
            if (richTextElementViewFunction != null) {
                view = richTextElementViewFunction.apply(richTextElement);
            }
            return view != null ? Collections.singletonList(view) : Collections.emptyList();
        }
    }

    public static class EditorialMarkupProcessor implements RichTextProcessorFunction {

        public static final EditorialMarkupProcessor INSTANCE = new EditorialMarkupProcessor();

        @Override
        public String apply(String html) {
            Document document = Jsoup.parseBodyFragment(html);
            Element body = document.body();
            document.outputSettings().prettyPrint(false);

            body.getElementsByTag("del").remove();
            body.getElementsByTag("ins").unwrap();
            body.getElementsByClass("rte").remove();
            body.select("code[data-annotations]").remove();

            return body.html();
        }
    }

    public static class LineBreakProcessor implements RichTextProcessorFunction {

        private Tag tag;

        private Map<String, String> attributes;

        public LineBreakProcessor() {
            this("p", null);
        }

        // TODO: Support additional tags
        private LineBreakProcessor(String tagName) {
            this(tagName, null);
        }

        // TODO: Support additional tags and attributes
        private LineBreakProcessor(String tagName, Map<String, String> attributes) {
            this.tag = Tag.valueOf(tagName);
            this.attributes = attributes;
        }

        @Override
        public String apply(String html) {

            Document document = Jsoup.parseBodyFragment(html);
            Element body = document.body();
            document.outputSettings().prettyPrint(false);

            body.select(".cms-textAlign-left, .cms-textAlign-center, .cms-textAlign-right, ol, ul").forEach(element -> {
                Element next = element.nextElementSibling();

                if (next != null && BR_TAG.equals(next.tag())) {
                    next.remove();
                }
            });

            body.select(".cms-textAlign-left, .cms-textAlign-center, .cms-textAlign-right")
                .forEach(div -> div.tagName(tag.getName()));

            // Convert 'text<br><br>' to '<p>text</p>'.
            for (Element br : body.getElementsByTag(BR_TAG.getName())) {
                Element previousBr = null;

                // Find the closest previous <br> without any intervening content.
                for (Node previousNode = br;
                     (previousNode = previousNode.previousSibling()) != null;
                    ) {
                    if (previousNode instanceof Element) {
                        Element previousElement = (Element) previousNode;

                        if (BR_TAG.equals(previousElement.tag())) {
                            previousBr = previousElement;
                        }

                        break;

                    } else if (previousNode instanceof TextNode
                        && !((TextNode) previousNode).isBlank()) {
                        break;
                    }
                }

                if (previousBr == null) {
                    continue;
                }

                List<Node> paragraphChildren = new ArrayList<>();

                for (Node previous = previousBr;
                     (previous = previous.previousSibling()) != null;
                    ) {
                    if (previous instanceof Element
                        && ((Element) previous).isBlock()) {
                        break;

                    } else {
                        paragraphChildren.add(previous);
                    }
                }

                Element paragraph = document.createElement(tag.getName());

                for (Node child : paragraphChildren) {
                    child.remove();
                    paragraph.prependChild(child.clone());
                }

                br.before(paragraph);
                br.remove();
                previousBr.remove();
            }

            // Convert inline text first in body and after block elements into
            // paragraphs.
            if (body.childNodeSize() > 0) {
                Node next = body.childNode(0);

                do {
                    if (!(next instanceof TextNode
                        && ((TextNode) next).isBlank())) {
                        break;
                    }
                } while ((next = next.nextSibling()) != null);

                Element lastParagraph = inlineTextToParagraph(next);

                if (lastParagraph != null) {
                    body.prependChild(lastParagraph);
                }
            }

            for (Element paragraph : body.getAllElements()) {
                if (!paragraph.isBlock()) {
                    continue;
                }

                Node next = paragraph;

                while ((next = next.nextSibling()) != null) {
                    if (!(next instanceof TextNode
                        && ((TextNode) next).isBlank())) {
                        break;
                    }
                }

                Element lastParagraph = inlineTextToParagraph(next);

                if (lastParagraph != null) {
                    paragraph.after(lastParagraph);
                }
            }

            // Convert '<div>text<div><div><br></div>' to '<p>text</p>'
            List<Element> divs = new ArrayList<>();

            DIV: for (Element div : body.getElementsByTag(DIV_TAG.getName())) {
                Element brDiv = nextTag(DIV_TAG, div);

                if (brDiv == null) {
                    continue;
                }

                // '<div><br></div>'?
                boolean sawBr = false;

                for (Node child : brDiv.childNodes()) {
                    if (child instanceof TextNode) {
                        if (!((TextNode) child).isBlank()) {
                            continue DIV;
                        }

                    } else if (child instanceof Element
                        && BR_TAG.equals(((Element) child).tag())) {
                        if (sawBr) {
                            continue DIV;

                        } else {
                            sawBr = true;
                        }

                    } else {
                        continue DIV;
                    }
                }

                divs.add(div);
                div.tagName(tag.getName());
                brDiv.remove();
            }

            for (Element div : divs) {
                div = nextTag(DIV_TAG, div);

                if (div != null) {
                    div.tagName(tag.getName());
                }
            }

            // Unwrap nested '<p>'s.
            for (Element paragraph : body.getElementsByTag(tag.getName())) {
                if (paragraph.getElementsByTag(tag.getName()).size() > 1) {
                    paragraph.unwrap();
                }
            }

            Map<String, ObjectType> tagTypes = getRteTagTypes();

            // <p>before [enh] after</p> -> <p>before</p> [enh] <p>after</p>
            // TODO: Support ReferentialText
            String rteTagsDomSelector = getRteTagsDomSelector();
            if (rteTagsDomSelector != null) {
                for (Element enhancement : body.select(rteTagsDomSelector)) {

                    ObjectType tagType = tagTypes.get(enhancement.tagName());
                    if (tagType != null) {

                        Class<?> tagClass = tagType.getObjectClass();
                        if (tagClass != null) {

                            RichTextElement.Tag rteTag = tagClass.getAnnotation(RichTextElement.Tag.class);
                            if (rteTag != null && !rteTag.block()) {
                                continue;
                            }
                        }
                    }

                    Element paragraph = enhancement.parent();

                    if (tag.equals(paragraph.tag())) {
                        Element before = new Element(tag, "");
                        List<Node> beforeChildren = new ArrayList<>();

                        for (Node previous = enhancement.previousSibling();
                             previous != null;
                             previous = previous.previousSibling()) {
                            beforeChildren.add(previous);
                        }

                        for (int i = beforeChildren.size() - 1; i >= 0; --i) {
                            before.appendChild(beforeChildren.get(i));
                        }

                        if (!before.childNodes().isEmpty()) {
                            before.attributes().addAll(paragraph.attributes());
                            paragraph.before(before);
                        }

                        paragraph.before(enhancement);
                    }
                }
            }

            return body.html();
        }

        // Find the closest next tag without any intervening content.
        private Element nextTag(Tag tag, Element current) {
            Element nextTag = null;

            for (Node nextNode = current;
                 (nextNode = nextNode.nextSibling()) != null;
                ) {
                if (nextNode instanceof Element) {
                    Element nextElement = (Element) nextNode;

                    if (tag.equals(nextElement.tag())) {
                        nextTag = nextElement;
                    }

                    break;

                } else if (nextNode instanceof TextNode
                    && !((TextNode) nextNode).isBlank()) {
                    break;
                }
            }

            return nextTag;
        }

        private Element inlineTextToParagraph(Node next) {
            if (next == null) {
                return null;
            }

            List<Node> paragraphChildren = new ArrayList<>();

            do {
                if (next instanceof Element
                    && ((Element) next).isBlock()) {
                    break;

                } else {
                    paragraphChildren.add(next);
                }
            } while ((next = next.nextSibling()) != null);

            if (paragraphChildren.isEmpty()) {
                return null;
            }

            Element lastParagraph = new Element(tag, "");

            for (Node child : paragraphChildren) {
                child.remove();
                lastParagraph.appendChild(child.clone());
            }

            return lastParagraph;
        }
    }

    @Deprecated
    public static final String REFERENCE_VIEW_TYPE = "ref";

    @Deprecated
    @FunctionalInterface
    public interface ReferenceViewFunction extends Function<Reference, Object> {
    }

    @Deprecated
    private ReferenceViewFunction referenceViewFunction;

    @Deprecated
    public RichTextProcessor referenceViewFunction(ReferenceViewFunction referenceViewFunction) {
        this.referenceViewFunction = referenceViewFunction;
        return this;
    }
}
