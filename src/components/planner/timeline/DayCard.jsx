import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Trash2 } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Chip } from '@/components/ui';
import { useTripStore, HOTEL_CLASS_STARS } from '@/store/tripStore';
import { experiences } from '@/data/experiences';
import { cn } from '@/utils/cn';
import { HotelClassChips } from './HotelClassChips';
import { TransportModeChips } from './TransportModeChips';
import { DayExperiencePicker } from './DayExperiencePicker';

const experiencesById = new Map(experiences.map((e) => [e.id, e]));
const FIELD = 'w-full rounded-lg border border-line bg-white px-3 py-2 font-sans text-small text-navy';

// One timeline day — collapsed shows Day N · phase · title; expanded is
// either the editable planner surface or (readOnly, TourDetail/V9) a plain
// read display of the same fields. Framer owns expand/collapse in both
// modes; the connecting line is GSAP, owned by the parent Timeline.
//
// readOnly never renders an input/chip-toggle/remove button — plain text
// instead — so a visitor reading a tour page can't accidentally rewrite it,
// and (just as important) so this component never has a reason to call
// editDay/removeDay/toggleDayExperience while readOnly, which would mutate
// the visitor's own in-progress trip in the global store.
export function DayCard({ day, index, readOnly = false }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = usePrefersReducedMotion();
  const editDay = useTripStore((s) => s.editDay);
  const removeDay = useTripStore((s) => s.removeDay);
  const toggleDayExperience = useTripStore((s) => s.toggleDayExperience);

  const panelId = `day-panel-${day.day}`;
  const stars = HOTEL_CLASS_STARS[day.hotelClass ?? 'Standard'];
  const dayExperiences = day.experienceIds.map((id) => experiencesById.get(id)).filter(Boolean);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((e) => !e)}
          className="flex min-h-11 flex-1 items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="label text-cyan-deep">Day {index + 1}</span>
            <span className="mt-0.5 block font-display text-h3 text-navy">{day.title || 'Untitled day'}</span>
          </span>
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className={cn('shrink-0 text-slate transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
        {!readOnly && (
          <button
            type="button"
            aria-label={`Remove Day ${index + 1}`}
            onClick={() => removeDay(day.day)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-mist hover:text-red-600"
          >
            <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="overflow-hidden border-t border-line"
          >
            {readOnly ? (
              <div className="flex flex-col gap-4 p-4">
                {day.description && <p className="text-body text-slate">{day.description}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {day.hotel && (
                    <div>
                      <span className="label text-slate">Hotel</span>
                      <p className="flex items-center gap-2 text-small text-navy">
                        {day.hotel}
                        <span className="flex items-center gap-0.5 text-slate" aria-label={`${stars} star`}>
                          {Array.from({ length: stars }).map((_, i) => (
                            <Star key={i} size={11} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                          ))}
                        </span>
                      </p>
                    </div>
                  )}
                  {day.transport && (
                    <div>
                      <span className="label text-slate">Transport</span>
                      <p className="text-small text-navy">{day.transport}</p>
                    </div>
                  )}
                </div>
                {dayExperiences.length > 0 && (
                  <div>
                    <span className="label text-slate">Included experiences</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dayExperiences.map((e) => (
                        <Chip key={e.id} size="sm">
                          {e.name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-5 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="label text-slate">Title</span>
                    <input
                      className={FIELD}
                      value={day.title ?? ''}
                      onChange={(e) => editDay(day.day, { title: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="label text-slate">Transport</span>
                    <input
                      className={FIELD}
                      value={day.transport ?? ''}
                      onChange={(e) => editDay(day.day, { transport: e.target.value })}
                    />
                  </label>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="label text-slate">Vehicle</span>
                    <TransportModeChips
                      value={day.transportMode}
                      onChange={(mode) => editDay(day.day, { transportMode: mode })}
                    />
                  </div>
                  <label className="flex flex-col gap-1 sm:col-span-2">
                    <span className="label text-slate">Description</span>
                    <textarea
                      rows={2}
                      className={cn(FIELD, 'resize-y')}
                      value={day.description ?? ''}
                      onChange={(e) => editDay(day.day, { description: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="label text-slate">Hotel</span>
                    <input
                      className={FIELD}
                      value={day.hotel ?? ''}
                      onChange={(e) => editDay(day.day, { hotel: e.target.value })}
                    />
                  </label>
                  <div className="flex flex-col gap-1">
                    <span className="label text-slate">Hotel class</span>
                    <div className="flex items-center gap-3">
                      <HotelClassChips value={day.hotelClass} onChange={(tier) => editDay(day.day, { hotelClass: tier })} />
                      <span className="flex items-center gap-0.5 text-slate" aria-label={`${stars} star`}>
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} size={12} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                        ))}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="label text-slate">Experiences on this day</span>
                  {dayExperiences.length > 0 && (
                    <p className="mt-1 text-small text-navy">{dayExperiences.map((e) => e.name).join(', ')}</p>
                  )}
                  <div className="mt-2">
                    <DayExperiencePicker
                      assignedIds={day.experienceIds}
                      onToggle={(id) => toggleDayExperience(day.day, id)}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
