import type { BuildStep } from '../engine/projectEngine';

interface Props {
  steps: BuildStep[];
}

export default function BuildProgress({ steps }: Props) {
  return (
    <div className="build-progress">
      {steps.map((step) => {
        const isComplete = step.status === 'complete';
        const isActive = step.status === 'active';
        const isPending = step.status === 'pending';
        const isError = step.status === 'error';

        return (
          <div key={step.id} className={`build-step ${step.status}`}>
            <div className="step-icon">
              {isComplete && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
              {isActive && <div className="spinner" />}
              {isPending && <div className="pending-dot" />}
              {isError && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
            </div>
            <div className="step-content">
              <span className="step-label">{step.label}</span>
              {step.detail && isActive && <span className="step-detail">{step.detail}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
