<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div>

	<div data-bsp-template data-bsp-template-options='{ "template": "components/page-title", "dataUrl": "/static/data/page-title.json" }'></div>

	<div class="bsp-container">
		<div class="bsp-row">
			<main class="bsp-column-full">

				<div class="bsp-row">
					<div class="bsp-column-main">
						
						<div data-bsp-template data-bsp-template-options='{ "template": "components/img-promo", "dataUrl": "/static/data/img-promo.json" }'></div>

					</div>

					<div class="bsp-column-aside">

						<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/data/list-promo.json" }'></div>

						<div data-bsp-template data-bsp-template-options='{ "template": "components/img-promo", "dataUrl": "/static/data/img-promo-wicked.json" }'></div>

					</div>
				</div>

				<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module", "dataUrl": "/static/data/gallery-module.json" }'></div>

			</main>
		</div>
	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
