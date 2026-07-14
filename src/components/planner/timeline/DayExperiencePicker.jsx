import { Chip } from '@/components/ui';
import { experiences } from '@/data/experiences';

// Compact picker for assigning experiences to ONE day — plain toggle chips
// rather than the full ExperienceCard grid (that's step 3's job; this is a
// smaller "which day is this on" annotation, not a second shopping surface).
export function DayExperiencePicker({ assignedIds, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {experiences.map((experience) => (
        <Chip
          key={experience.id}
          variant="toggle"
          selected={assignedIds.includes(experience.id)}
          onToggle={() => onToggle(experience.id)}
        >
          {experience.name}
        </Chip>
      ))}
    </div>
  );
}
