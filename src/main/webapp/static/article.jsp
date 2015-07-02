<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">
			
			<div class="bsp-row">
				<div class="bsp-column-persistent">

					<div class="bsp-article-wrapper">
					
						<div data-bsp-template data-bsp-template-options='{ "template": "components/article", "dataUrl": "/static/data/article.json" }'></div>

					</div>

				</div>

				<div class="bsp-column-add-on">

					<div class="bsp-column-fixed">

						<div data-bsp-template data-bsp-template-options='{ "template": "components/list-promo", "dataUrl": "/static/data/list-promo-article-rr.json" }'></div>

					</div>

				</div>
			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
