<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="../common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div>

	<div class="bsp-site">

		<div data-bsp-template data-bsp-template-options='{ "template": "components/page-title", "dataUrl": "/static/data/page-title.json" }'></div>

		<div class="bsp-container">

			<div class="bsp-row">

				<div class="bsp-column-half">

					<%-- Item with just image, no text  --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-just-image.json" }'></div>

				</div>

				<div class="bsp-column-half">

					<%-- Item with just image, no text  --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-no-title.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-half">

					<%-- Item with Left Align, Dark Background --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-left-align-dark.json" }'></div>

				</div>

				<div class="bsp-column-half">

					<%-- Item with Left Align, No Background --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-left-align.json" }'></div>

				</div>

			</div>
			
			<div class="bsp-row">

				<div class="bsp-column-half">

					<%-- 1 Item with Image Overlay --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-overlay.json" }'></div>

				</div>

				<div class="bsp-column-half">

					<%-- 1 Item with Image --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-half">

					<%-- 2 Items with images and extra text --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/2-items-with-images-extra-text.json" }'></div>

				</div>

				<div class="bsp-column-half">

					<%-- 2 items with images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/2-items-with-images.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-third">

					<%-- 2 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/2-items.json" }'></div>

				</div>

				<div class="bsp-column-third">

					<%-- 3 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/3-items.json" }'></div>

				</div>

				<div class="bsp-column-third">

					<%-- 4 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/4-items.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-third">

					<%-- 5 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/5-items.json" }'></div>

				</div>

				<div class="bsp-column-third">

					<%-- 6 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/6-items.json" }'></div>

				</div>

				<div class="bsp-column-third">

					<%-- 7 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/7-items.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-third">

					<%-- 5 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/6-items-with-1-image.json" }'></div>

				</div>

				<div class="bsp-column-third">

					<%-- 6 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/4-items-with-2-images.json" }'></div>

				</div>

				<div class="bsp-column-third">

					<%-- 7 Items no images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/3-items-with-1-image-extra-text.json" }'></div>

				</div>

			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="../common/page-end.jsp" />
