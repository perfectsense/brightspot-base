<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-header", "dataUrl": "/static/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">

			<div class="bsp-row">

				<div class="bsp-column-full">

					<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery", "dataUrl": "/static/data/gallery.json" }'></div>

				</div>

			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "components/bsp-site-footer", "dataUrl": "/static/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />