<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div>

	<div data-bsp-template data-bsp-template-options='{ "template": "components/page-title", "dataUrl": "/static/data/page-title.json" }'></div>

	<div class="bsp-container">
		<div class="bsp-row">
			<main class="bsp-column-full">

				<div class="bsp-row">
					<div class="bsp-column-main">
						
						<div class="bsp-promo">
							<div class="bsp-promo-image">
								<img src="/assets/images/800x450.png" alt="" />
							</div>
							<div class="bsp-promo-text">
								<div class="bsp-promo-title">
									Bacon ipsum dolor amet turducken jowl shankle, cupim fatback jerky 
								</div>
								<div class="bsp-promo-desc">
									Shankle pork loin landjaeger pork chop t-bone. Shank capicola strip steak, salami prosciutto ham hock venison. Short ribs meatloaf doner hamburger frankfurter tri-tip.
								</div>
							</div>
						</div>


					</div>
					<div class="bsp-column-aside">
						
					</div>
				</div>

				<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module", "dataUrl": "/static/data/gallery-module.json" }'></div>

			</main>
		</div>
	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
