<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>

<jsp:include page="common/page-start.jsp" />

<div class="bsp-site-wrapper">

	<div data-bsp-template data-bsp-template-options='{ "template": "test", "dataUrl": "/static/data/test/testPartial.json" }'></div>

</div>

<jsp:include page="common/page-end.jsp" />
