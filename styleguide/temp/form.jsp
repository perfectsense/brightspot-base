<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/components/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">
			<div class="bsp-row">
				<main class="bsp-column-full">

					<div class="bsp-row">
							
							<div data-bsp-template data-bsp-template-options='{ "template": "components/form", "dataUrl": "/static/data/form.json" }'></div>
						
					</div>

				</main>
			</div>
		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/components/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
