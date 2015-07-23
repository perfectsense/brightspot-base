<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="../common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-site-header/logo-extra-menu-social.json" }'></div>

	<div class="bsp-site">

		<div class="bsp-container">
			
			<div class="bsp-row">
				<div class="bsp-column-scrolling">

					<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-article/article-infinite-1.json" }'></div>

				</div>

				<div class="bsp-column-fixed-wrap" data-bsp-toggle-item>

					<div class="bsp-column-fixed toggle-item">

						<div class="bsp-trigger-fixed-column toggle-trigger">
							<a class="toggle-trigger-link-out" href="#">Open</a>
							<a class="toggle-trigger-link-in" href="#">Close</a>
						</div>

						<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-list-promo/article-infinite-status.json" }'></div>

					</div>

				</div>
			</div>

		</div>

	</div>

	<div data-bsp-template data-bsp-template-options='{ "dataUrl": "/static/bsp-site-footer/standard.json" }'></div>

</div>

<jsp:include page="../common/page-end.jsp" />
