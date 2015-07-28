<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">

			<div class="bsp-row">
				<div class="bsp-column-main">

					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-table/basic-table.json" }'></div>
					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-table/table-standard.json" }'></div>
					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-table/table-fixed-width.json" }'></div>
					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-table/table-horiz-stripe.json" }'></div>
					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-table/table-vert-stripe.json" }'></div>
					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-table/table-with-image.json" }'></div>

				</div>

				<div class="bsp-column-aside">

					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-list-promo/6-items.json" }'></div>

				</div>
			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
