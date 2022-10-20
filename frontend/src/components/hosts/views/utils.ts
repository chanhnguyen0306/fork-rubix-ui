import { APPLICATION_STATES } from "../../../common/rb-tag";

export const tagMessageStateResolver = (
  state: string,
  subState: string,
  activeState: string
) => {
  if (
    state === APPLICATION_STATES.ENABLED &&
    activeState === APPLICATION_STATES.ACTIVE &&
    subState === APPLICATION_STATES.RUNNING
  ) {
    return "Application is enabled and running";
  } else if (
    state === APPLICATION_STATES.ENABLED &&
    activeState === APPLICATION_STATES.ACTIVATING &&
    subState === APPLICATION_STATES.AUTORESTART
  ) {
    return "Application is enabled and auto restarting.";
  } else if (
    state === APPLICATION_STATES.ENABLED &&
    activeState === APPLICATION_STATES.INACTIVE &&
    subState === APPLICATION_STATES.DEAD
  ) {
    return "Application enabled but is stopped.";
  } else if (
    state === APPLICATION_STATES.DISABLED &&
    activeState === APPLICATION_STATES.ACTIVE &&
    subState === APPLICATION_STATES.RUNNING
  ) {
    return "Application operations are disabled but running in background.";
  } else if (
    state === APPLICATION_STATES.DISABLED &&
    activeState === APPLICATION_STATES.INACTIVE &&
    subState === APPLICATION_STATES.DEAD
  ) {
    return "Application is disabled and stopped.";
  }
};
