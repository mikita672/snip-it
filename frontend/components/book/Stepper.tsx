import { cn } from "@/lib/utils"

export type StepId = 'treatments' | 'time' | 'employee' | 'confirm'

export interface Step {
    id: StepId;
    label: string;
}

interface StepperProps {
    steps: Step[];
    currentStepId: StepId;
}

export function Stepper({ steps, currentStepId }: StepperProps) {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);

    return (
        <div className="flex items-center w-full mb-8 px-4 md:px-0">
            {steps.map((step, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;
                
                return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2 relative">
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 border rounded text-sm font-semibold transition-colors bg-card",
                                isActive ? "border-primary text-primary" : 
                                isPast ? "border-muted-foreground text-muted-foreground" : "border-border text-muted-foreground"
                            )}>
                                {index + 1}
                            </div>
                            <span className={cn(
                                "text-xs font-medium absolute -bottom-6 whitespace-nowrap",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 h-[1px] mx-4 transition-colors",
                                isPast ? "bg-muted-foreground/50" : "bg-border"
                            )} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
