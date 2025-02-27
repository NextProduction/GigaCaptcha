import { useState } from "react";
import Challenge from "./Challenge";

const GigaCaptcha = ({ onSuccess }: { onSuccess: () => void }) => {
  const [solved, setSolved] = useState(false);

  return (
    <div className="giga-captcha">
      {solved ? (
        <p>✅ Captcha Solved!</p>
      ) : (
        <Challenge onSolve={() => {
          setSolved(true);
          onSuccess();
        }} />
      )}
    </div>
  );
};

export default GigaCaptcha;
