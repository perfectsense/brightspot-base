<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">
			<div class="bsp-row">
				<main class="bsp-column-full">

					<div class="bsp-row">
						<div class="bsp-column-main">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-horizontal", "dataUrl": "/static/data/top-shows-on-broadway.json" }'></div>
							
							<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-thumbs-or-nav", "dataUrl": "/static/data/featured-today.json" }'></div>

						</div>

						<div class="bsp-column-aside">

							Aside?

						</div>
					</div>

					<div class="bsp-row">
						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/data/list-promo-6.json" }'></div>

						</div>

						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/data/list-promo-with-images-2.json" }'></div>

						</div>

						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/data/list-promo-with-images-800x450.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/data/list-promo-2.json" }'></div>

						</div>
					</div>

				</main>
			</div>
		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
