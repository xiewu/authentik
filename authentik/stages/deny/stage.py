"""Deny stage logic"""

from django.http import HttpRequest, HttpResponse

from authentik.flows.stage import StageView
from authentik.stages.deny.models import DenyStage


class DenyStageView(StageView[DenyStage]):
    """Cancels the current flow"""

    def dispatch(self, request: HttpRequest) -> HttpResponse:
        """Cancels the current flow"""
        message = self.executor.plan.context.get("deny_message", self.current_stage.deny_message)
        return self.executor.stage_invalid(message)
