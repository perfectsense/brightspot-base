package com.brightspotbase;

import com.psddev.cms.db.*;
import com.psddev.cms.tool.CmsTool;
import com.psddev.dari.db.Application;
import com.psddev.dari.db.Modification;
import com.psddev.dari.db.ObjectType;
import com.psddev.dari.db.State;
import com.psddev.dari.util.MailMessage;
import com.psddev.dari.util.ObjectUtils;
import com.psddev.dari.util.SmsProvider;

import java.util.LinkedHashSet;
import java.util.Set;

public class WorkflowLogExtras extends Modification<WorkflowLog> {

    @Indexed
    @ToolUi.DropDown
    @ToolUi.Placeholder("Editors")
    @WorkflowLog.Persistent
    private Set<ToolEntity> editors;

    public Set<ToolEntity> getEditors() {
        if (editors == null) {
            editors = new LinkedHashSet<ToolEntity>();
        }
        return editors;
    }

    public void setEditors(Set<ToolEntity> editors) {
        this.editors = editors;
    }

    @Override
    protected void afterSave() {
        WorkflowLog log = getOriginalObject();
        String userName = log.getUserName();
        String transition = log.getTransition();
        State state = State.getInstance(log.getObject());
        String label = state.getLabel();
        String comment = log.getComment();
        String cmsUrl = Application.Static.getInstance(CmsTool.class).fullUrl("/content/edit.jsp", "id", state.getId());

        for (ToolEntity entity : getEditors()) {
            for (ToolUser receiver : entity.getUsers()) {
                for (NotificationMethod method : receiver.getNotifyVia()) {
                    switch (method) {
                        case EMAIL:
                            ObjectType type = state.getType();
                            MailMessage mail = new MailMessage();
                            StringBuilder subject = new StringBuilder();
                            StringBuilder body = new StringBuilder();

                            subject.append("[Workflow Notification] ");
                            subject.append(transition);
                            subject.append(" - ");
                            subject.append(label);

                            body.append("User: ").append(userName).append("\n");
                            body.append("Workflow: ").append(transition).append("\n");
                            body.append("Type: ").append(type.getLabel()).append("\n");
                            body.append("Content: ").append(label).append("\n");

                            if (!ObjectUtils.isBlank(comment)) {
                                body.append("Comment: ").append(comment).append("\n");
                            }

                            body.append("CMS URL: ").append(cmsUrl).append("\n");

                            mail.from("info@yoursite.com");
                            mail.to(receiver.getEmail());
                            mail.subject(subject.toString());
                            mail.bodyPlain(body.toString());
                            mail.send();
                            break;

                        case SMS:
                            StringBuilder message = new StringBuilder();

                            message.append("User: ").append(userName).append(", ");
                            message.append("Workflow: ").append(transition).append(", ");
                            message.append("Content: ").append(label).append(" - ");
                            message.append(comment).append(" - ");
                            message.append(cmsUrl);

                            SmsProvider.Static.getDefault().send(
                                    null,
                                    receiver.getPhoneNumber(),
                                    message.toString());
                            break;

                        default:
                            throw new UnsupportedOperationException(String.format(
                                    "Can't send notification via [%s]", method));
                    }
                }
            }
        }
    }
}