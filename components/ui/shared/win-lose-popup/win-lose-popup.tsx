import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "../../button";

interface WinLoseProps {
  isGameOver: boolean;
  handlePopupClose?: () => void;
  player?: string;
  isDraw?: boolean;
}

const WinLosePopup: React.FC<WinLoseProps> = ({
  isGameOver,
  handlePopupClose,
  player = "player1",
  isDraw = false,
}) => {
  const router = useRouter();
  return (
    <Dialog
      open={isGameOver}
      onOpenChange={handlePopupClose || (() => router.push("/games"))}
    >
      <DialogContent aria-label="Game Result" aria-describedby="game-result">
        <DialogTitle>{isDraw ? "It's a Draw!" : `${player} Wins!`}</DialogTitle>
        <DialogFooter>
          <Button onClick={handlePopupClose || (() => router.push("/games"))}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WinLosePopup;
