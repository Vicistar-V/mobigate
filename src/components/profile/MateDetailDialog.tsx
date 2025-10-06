import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SchoolMate } from "./EditSchoolMatesForm";
import { Classmate } from "./EditClassmatesForm";
import { AgeMate } from "./EditAgeMatesForm";
import { WorkColleague } from "./EditWorkColleaguesForm";

type MateType = SchoolMate | Classmate | AgeMate | WorkColleague;

interface MateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mate: MateType | null;
  type: "schoolmate" | "classmate" | "agemate" | "colleague";
}

export const MateDetailDialog = ({ open, onOpenChange, mate, type }: MateDetailDialogProps) => {
  if (!mate) return null;

  const renderSchoolMateDetails = (data: SchoolMate | Classmate) => (
    <>
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Full Name</h4>
        <p className="font-medium">{data.name}</p>
      </div>

      {data.nickname && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Nickname</h4>
          <p>{data.nickname}</p>
        </div>
      )}

      <Separator />

      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Institution</h4>
        <p>{data.institution}</p>
      </div>

      {data.period && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Period</h4>
          <p>{data.period}</p>
        </div>
      )}

      {data.postsHeld && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Posts Held</h4>
            <p className="whitespace-pre-wrap">{data.postsHeld}</p>
          </div>
        </>
      )}

      {data.sportsPlayed && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Sports Played</h4>
          <p className="whitespace-pre-wrap">{data.sportsPlayed}</p>
        </div>
      )}

      {data.clubsAssociations && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Clubs & Associations</h4>
          <p className="whitespace-pre-wrap">{data.clubsAssociations}</p>
        </div>
      )}

      {(data.favouriteTeacher || data.teacherNickname || data.teacherHometown || data.teacherSubject || data.teacherPosition) && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-primary mb-3">Favourite Class Teacher</h4>
            <div className="space-y-2 pl-4">
              {data.favouriteTeacher && (
                <div>
                  <span className="text-sm text-muted-foreground">Name: </span>
                  <span className="font-medium">{data.favouriteTeacher}</span>
                </div>
              )}
              {data.teacherNickname && (
                <div>
                  <span className="text-sm text-muted-foreground">Nickname: </span>
                  <span>{data.teacherNickname}</span>
                </div>
              )}
              {data.teacherHometown && (
                <div>
                  <span className="text-sm text-muted-foreground">Hometown: </span>
                  <span>{data.teacherHometown}</span>
                </div>
              )}
              {data.teacherSubject && (
                <div>
                  <span className="text-sm text-muted-foreground">Subject: </span>
                  <span>{data.teacherSubject}</span>
                </div>
              )}
              {data.teacherPosition && (
                <div>
                  <span className="text-sm text-muted-foreground">Position: </span>
                  <span>{data.teacherPosition}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {data.privacy && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Privacy</h4>
            <Badge variant={data.privacy === 'public' ? 'default' : data.privacy === 'friends' ? 'secondary' : 'outline'} className="capitalize">
              {data.privacy}
            </Badge>
          </div>
        </>
      )}
    </>
  );

  const renderAgeMateDetails = (data: AgeMate) => (
    <>
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Community</h4>
        <p className="font-medium">{data.community}</p>
      </div>

      {data.nickname && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Nickname</h4>
          <p>{data.nickname}</p>
        </div>
      )}

      <Separator />

      {data.ageGrade && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Age Grade</h4>
          <p>{data.ageGrade}</p>
        </div>
      )}

      {data.ageBrackets && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Age Brackets</h4>
          <p>{data.ageBrackets}</p>
        </div>
      )}

      {data.postsHeld && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Posts Held</h4>
            <p className="whitespace-pre-wrap">{data.postsHeld}</p>
          </div>
        </>
      )}

      {data.privacy && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Privacy</h4>
            <Badge variant={data.privacy === 'public' ? 'default' : data.privacy === 'friends' ? 'secondary' : 'outline'} className="capitalize">
              {data.privacy}
            </Badge>
          </div>
        </>
      )}
    </>
  );

  const renderColleagueDetails = (data: WorkColleague) => (
    <>
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Full Name</h4>
        <p className="font-medium">{data.name}</p>
      </div>

      {data.nickname && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Nickname</h4>
          <p>{data.nickname}</p>
        </div>
      )}

      <Separator />

      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Workplace</h4>
        <p>{data.workplaceName}</p>
      </div>

      {data.workplaceLocation && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Location</h4>
          <p>{data.workplaceLocation}</p>
        </div>
      )}

      {data.position && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Position</h4>
          <p>{data.position}</p>
        </div>
      )}

      {data.duration && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Duration</h4>
          <p>{data.duration}</p>
        </div>
      )}

      {data.superiority && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Superiority</h4>
            <Badge variant="secondary" className="capitalize">{data.superiority}</Badge>
          </div>
        </>
      )}

      {data.specialSkills && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Special Skills</h4>
          <p className="whitespace-pre-wrap">{data.specialSkills}</p>
        </div>
      )}

      {data.privacy && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Privacy</h4>
            <Badge variant={data.privacy === 'public' ? 'default' : data.privacy === 'friends' ? 'secondary' : 'outline'} className="capitalize">
              {data.privacy}
            </Badge>
          </div>
        </>
      )}
    </>
  );

  const getTitle = () => {
    switch (type) {
      case "schoolmate":
        return "School Mate Details";
      case "classmate":
        return "Classmate Details";
      case "agemate":
        return "Age Mate Details";
      case "colleague":
        return "Work Colleague Details";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {(type === "schoolmate" || type === "classmate") && renderSchoolMateDetails(mate as SchoolMate | Classmate)}
          {type === "agemate" && renderAgeMateDetails(mate as AgeMate)}
          {type === "colleague" && renderColleagueDetails(mate as WorkColleague)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
