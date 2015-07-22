<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="../common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-header", "dataUrl": "/static/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">
			<div class="bsp-row">
				<main class="bsp-column-full">

					<%-- 5 slides at a time (2 on mobile) --%>

					<%-- <div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-horizontal", "dataUrl": "/static/gallery-module/5-slides-horizontal.json" }'></div> --%>

					<%-- 4 slides with text nav --%>

					<%--  <div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-thumbs-or-nav", "dataUrl": "/static/gallery-module/4-slides-text-nav.json" }'></div> --%>

					<%-- 5 slides --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-gallery-module", "dataUrl": "/static/bsp-gallery-module/5-slides.json" }'></div>
					
					<%-- 7 slides with dots --%>

					<%-- <div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module", "dataUrl": "/static/gallery-module/7-slides-dots.json" }'></div> --%>

					<%-- 7 slides with thumbnails --%>

					<%-- <div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-thumbs-or-nav", "dataUrl": "/static/gallery-module/5-slides-with-thumbs.json" }'></div> --%>


				</main>
			</div>
		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-footer", "dataUrl": "/static/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="../common/page-end.jsp" />
