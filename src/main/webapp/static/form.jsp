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
							
							<div data-bsp-template data-bsp-template-options='{ "template": "components/form", "dataUrl": "/static/data/form.json" }'></div>

						</div>
						
					</div>

				</main>
			</div>
		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
