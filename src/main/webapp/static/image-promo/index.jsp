<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="../common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-header", "dataUrl": "/static/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div data-bsp-template data-bsp-template-options='{ "template": "components/page-title", "dataUrl": "/static/data/page-title.json" }'></div>

		<div class="bsp-container">

			<div class="bsp-row">

				<div class="bsp-column-half">

					<%-- 1 image with 1 link--%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/1-image-1-link.json" }'></div>

				</div>

				<div class="bsp-column-half">

					<%-- 1 image with 3 links --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/1-image-3-links.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-full">

					<%-- 2 images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/2-images-1-link.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-full">

					<%-- 3 images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/3-images-1-link.json" }'></div>

				</div>

			</div>

			<div class="bsp-row">

				<div class="bsp-column-full">

					<%-- 4 images --%>

					<div data-bsp-template data-bsp-template-options='{ "template": "components/image-promo", "dataUrl": "/static/image-promo/4-images-1-link.json" }'></div>

				</div>

			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-footer", "dataUrl": "/static/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="../common/page-end.jsp" />
