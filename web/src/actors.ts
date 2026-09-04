import type { ActorIdentity, AssigneeTarget } from "./types";

const CONFIGURED_AGENT_ASSIGNEE_PREFIX = "configured-agent:";

export const CODEX_AGENT_ACTOR: ActorIdentity = {
  type: "agent",
  id: "codex-agent",
  name: "Codex Agent",
  avatarUrl: null,
};

export const BUILTIN_AGENT_ACTORS: ActorIdentity[] = [
  "需求规划师",
  "开发工程师",
  "测试工程师",
  "代码审查员",
].map((name) => ({
  type: "agent",
  id: `${CONFIGURED_AGENT_ASSIGNEE_PREFIX}${name}`,
  name,
  avatarUrl: null,
}));

export function actorKey(actor: ActorIdentity): string {
  return `${actor.type}:${actor.id}`;
}

export function actorForAssigneeTarget(
  target: AssigneeTarget,
  currentUser: ActorIdentity,
): ActorIdentity {
  if (target === "current-user") return currentUser;
  if (target === "codex-agent") return CODEX_AGENT_ACTOR;
  return {
    type: "agent",
    id: target,
    name: target.slice(CONFIGURED_AGENT_ASSIGNEE_PREFIX.length),
    avatarUrl: null,
  };
}

export function assigneeTargetForActor(
  actor: ActorIdentity,
  currentUser: ActorIdentity,
): AssigneeTarget | undefined {
  if (actor.type === "agent") {
    if (actor.id === CODEX_AGENT_ACTOR.id) return "codex-agent";
    if (actor.id.startsWith(CONFIGURED_AGENT_ASSIGNEE_PREFIX)) {
      return actor.id as AssigneeTarget;
    }
    return undefined;
  }
  return actor.id === currentUser.id ? "current-user" : undefined;
}

export function configuredAgentNameForActor(actor: ActorIdentity): string | null {
  return actor.type === "agent" && actor.id.startsWith(CONFIGURED_AGENT_ASSIGNEE_PREFIX)
    ? actor.name
    : null;
}
