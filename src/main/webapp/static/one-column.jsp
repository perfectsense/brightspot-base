<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<!-- <div data-bsp-template data-bsp-template-options='{ "template": "common/header", "dataUrl": "/static/data/header.json" }'></div> -->

	<div class="bsp-site-header" data-bsp-toggle-item>
	
		<div class="bsp-site-logo-centering">
			<h1 class="bsp-site-logo">
				<a href="#">
				<img class="" src="/assets/images/brightspot.png" alt="Brightspot"><span class="sr-only">Brightspot</span>
				</a>
			</h1>
		</div>

		<div class="bsp-site-search-centering">
			<div class="bsp-site-search toggle-item">
				<form class="bsp-site-search-form">
					<input class="bsp-search-input" type="text" />
					<button class="bsp-search-submit" type="submit"><i class="icon icon-search"><span class="sr-only">Go</span></i></button>
				</form>
			</div>
		</div>

		<div class="bsp-header-extra">
			<ul class="bsp-header-extra-links">
				<li><a class="bsp-header-extra-link" href="#">Extra Link</a></li>
				<li><a class="bsp-header-extra-link" href="#">Extra Link</a></li>
			</ul>
		</div>

		<div class="bsp-share-links-centering">
			<ul class="bsp-share-links" data-bsp-share data-bsp-share-options='{"iconClass":"icon", "serviceProps":{"facebook":{"appId":"645138725541385"}}}'>
				<li class="bsp-facebook-share"></li>   
			    <li class="bsp-twitter-share"></li>    
			    <li class="bsp-pinterest-share"></li>  
			    <li class="bsp-linkedin-share"></li> 
			</ul>
		</div>

		<div class="bsp-site-search-trigger toggle-trigger">
			<a href="#"><i class="icon icon-search"><span class="sr-only">show search form</span></i></a>
		</div>

	</div>

	<div class="bsp-container">
		<div class="bsp-row">
			<main class="bsp-column-full">

				<div data-bsp-template data-bsp-template-options='{ "template": "components/gallery-module", "dataUrl": "/static/data/gallery-module.json" }'></div>

			</main>
		</div>
	</div>

	<div data-bsp-template data-bsp-template-options='{ "template": "common/footer", "dataUrl": "/static/data/footer.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
