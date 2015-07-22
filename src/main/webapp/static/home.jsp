<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-header", "dataUrl": "/static/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">

			<div class="bsp-row">
				<div class="bsp-column-scrolling">

					<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-horizontal", "dataUrl": "/static/gallery-module/5-slides-horizontal.json" }'></div>
					
					<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module-thumbs-or-nav", "dataUrl": "/static/gallery-module/4-slides-text-nav.json" }'></div>

					<div class="bsp-row">
						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/6-items.json" }'></div>

						</div>

						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/2-items-with-images.json" }'></div>

						</div>

						<div class="bsp-column-third">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-just-image.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/3-items.json" }'></div>

						</div>
					</div>

					<div class="bsp-row">
						<div class="bsp-column-full">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/section-title", "dataUrl": "/static/data/section-title.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/1-image-3-links.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/2-images-1-link.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/1-image-3-links.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/4-images-1-link.json" }'></div>

						</div>
					</div>

					<div class="bsp-row">
						<div class="bsp-column-full">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/section-title", "dataUrl": "/static/data/section-title.json" }'></div>

							<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/3-images-1-link.json" }'></div>

						</div>

					</div>

					<div class="bsp-row">

						<div class="bsp-column-half">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/2-items-with-images-extra-text.json" }'></div>

						</div>

						<div class="bsp-column-half">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/2-items-with-images-extra-text.json" }'></div>

						</div>
					</div>

					<div class="bsp-row">

						<div class="bsp-column-full">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/section-title", "dataUrl": "/static/data/section-title.json" }'></div>

						</div>

					</div>

					<div class="bsp-row">

						<div class="bsp-column-half">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-left-align.json" }'></div>

						</div>

						<div class="bsp-column-half">

							<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/1-item-with-image-left-align-dark.json" }'></div>

						</div>

					</div>


				</div>

				<div class="bsp-column-fixed-wrap">

					<div class="bsp-column-fixed">

						<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/list-promo/6-items.json" }'></div>

					</div>

				</div>
			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-footer", "dataUrl": "/static/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
