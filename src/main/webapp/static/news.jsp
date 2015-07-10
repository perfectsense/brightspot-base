<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div>

	<div class="bsp-site">

		<div data-bsp-template data-bsp-template-options='{ "template": "components/page-title", "dataUrl": "/static/data/page-title.json" }'></div>

		<div class="bsp-container">
			<div class="bsp-row">
				<main class="bsp-column-full">

					<div class="bsp-row">
						<div class="bsp-column-main">
							
							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-no-title.json" }'></div>

						</div>

						<div class="bsp-column-aside">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/5-items.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-just-image.json" }'></div>

						</div>
						
					</div>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/4-images-1-link.json" }'></div>

					<div class="bsp-row">

						<div class="bsp-column-third">
							
							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-just-image.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/3-items.json" }'></div>

						</div>

						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/7-items.json" }'></div>

						</div>

						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/7-items.json" }'></div>

						</div>
						
					</div>

					<div class="bsp-row">

						<div class="bsp-column-aside">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/6-items.json" }'></div>

						</div>

						<div class="bsp-column-main">
							
							<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module", "dataUrl": "/static/gallery-module/5-slides.json" }'></div>

						</div>
						
					</div>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-thumbs-or-nav", "dataUrl": "/static/gallery-module/5-slides-with-thumbs.json" }'></div>

				</main>
			</div>
		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
