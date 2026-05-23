interface SkillLevelBadgeProps {
  skill: {
    name: string;
    currentLevel: string;
    requiredLevel: string;
    gap: string;
    importance: string;
    description: string;
  };
  index?: number;
}

export default function SkillLevelBadge({ skill, index = 0 }: SkillLevelBadgeProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-success/20 text-success border-success/30';
      case 'Advanced':
        return 'bg-info/20 text-info border-info/30';
      case 'Intermediate':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Beginner':
        return 'bg-gray-200 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case 'High':
        return 'bg-danger/20 text-danger border-danger/30';
      case 'Medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Low':
        return 'bg-success/20 text-success border-success/30';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="p-4 bg-bg-muted rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h5 className="font-semibold text-text-primary">{skill.name}</h5>
          <p className="text-sm text-text-secondary mt-1">{skill.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ml-3 ${
            skill.importance === 'High'
              ? 'bg-danger/10 text-danger'
              : skill.importance === 'Medium'
              ? 'bg-warning/10 text-warning'
              : 'bg-success/10 text-success'
          }`}
        >
          {skill.importance} Priority
        </span>
      </div>

      {/* Skill Level Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Current:</span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getLevelColor(skill.currentLevel)}`}>
              {skill.currentLevel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Required:</span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getLevelColor(skill.requiredLevel)}`}>
              {skill.requiredLevel}
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Skill Gap:</span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getGapColor(skill.gap)}`}>
              {skill.gap} Gap
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
