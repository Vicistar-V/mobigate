import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, Users, CheckCircle, Zap, Loader2, XCircle } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { GroupQuizPlayDialog } from "./GroupQuizPlayDialog";

const API = "/api/quiz/group.php";

interface Member {
  user_id: string; name: string; avatar?: string; is_host: number;
  status: "invited" | "accepted" | "declined"; has_submitted: number;
}
interface Lobby { id: string; stake: string; multiplier: number; status: string }

interface GroupQuizLobbySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lobbyId: string;
}

export function GroupQuizLobbySheet({ open, onOpenChange, lobbyId }: GroupQuizLobbySheetProps) {
  const { toast } = useToast();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [myStatus, setMyStatus] = useState<string>("invited");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadLobby = useCallback(() => {
    fetch(`${API}?action=lobby&lobby_id=${lobbyId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        setLobby(d.lobby);
        setMembers(d.members ?? []);
        setIsHost(!!d.is_host);
        setMyStatus(d.my_status);
        if (d.lobby?.status === "in_progress") setShowPlay(true);
      })
      .catch(() => {});
  }, [lobbyId]);

  useEffect(() => {
    if (!open) { if (pollRef.current) clearInterval(pollRef.current); return; }
    setLoading(true);
    loadLobby();
    setLoading(false);
    pollRef.current = setInterval(loadLobby, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open, loadLobby]);

  const acceptedCount = members.filter((m) => m.status === "accepted").length;
  const stake = lobby ? parseFloat(lobby.stake) : 0;
  const totalPrize = stake * (lobby?.multiplier ?? 2);

  const handleStartNow = async () => {
    setStarting(true);
    try {
      const res = await fetch(API, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_game", lobby_id: lobbyId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't start game");
      loadLobby();
    } catch (e: any) {
      toast({ title: "Couldn't Start Game", description: e.message, variant: "destructive" });
    } finally {
      setStarting(false);
    }
  };

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" /> Group Quiz Lobby
            </DrawerTitle>
          </DrawerHeader>

          {loading && !lobby ? (
            <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-purple-500" /></div>
          ) : (
          <div className="px-4 pb-4 space-y-4 overflow-y-auto touch-auto">
            <Card className="border-purple-200">
              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Stake</p>
                    <p className="font-bold text-sm text-red-600">{formatMobiAmount(stake)}</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Multiplier</p>
                    <p className="font-bold text-sm text-purple-600">{(lobby?.multiplier ?? 2) * 100}%</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Prize</p>
                    <p className="font-bold text-sm text-green-600">{formatMobiAmount(totalPrize)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Players ({acceptedCount + (isHost ? 0 : 0)})</p>
                <Badge variant="outline" className="text-[10px]">{members.length}/10 invited</Badge>
              </div>

              {members.map((m) => (
                <div key={m.user_id} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                  m.status === "accepted" ? "border-green-300 bg-green-50 dark:bg-green-950/20" :
                  m.status === "declined" ? "border-red-200 bg-red-50/50 dark:bg-red-950/10 opacity-60" : "border-border"
                }`}>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={m.is_host ? "bg-purple-200 text-purple-700 text-xs" : "text-xs"}>
                      {(m.name || "?").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.name}{m.is_host ? " (Host)" : ""}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.status === "accepted" ? "Accepted" : m.status === "declined" ? "Declined" : "Waiting..."}
                    </p>
                  </div>
                  {m.status === "accepted" ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                   m.status === "declined" ? <XCircle className="h-5 w-5 text-red-400" /> :
                   <Clock className="h-5 w-5 text-muted-foreground animate-pulse" />}
                </div>
              ))}
            </div>

            {isHost ? (
              <Button
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                onClick={handleStartNow}
                disabled={acceptedCount < 3 || starting}
              >
                {starting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                {acceptedCount < 3 ? `Waiting for players (${acceptedCount}/3)` : "Start Game Now!"}
              </Button>
            ) : (
              <p className="text-xs text-center text-muted-foreground py-2">
                Waiting for the host to start the game...
              </p>
            )}
          </div>
          )}
        </DrawerContent>
      </Drawer>

      <GroupQuizPlayDialog
        open={showPlay}
        onOpenChange={(v) => {
          if (!v) {
            setShowPlay(false);
            onOpenChange(false);
          }
        }}
        lobbyId={lobbyId}
      />
    </>
  );
}
