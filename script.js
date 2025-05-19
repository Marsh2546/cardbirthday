// ==== script.js: ควบคุมการเล่นเพลง และ OTP ปลดล็อกข้อความลับ ====

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-btn");
  const bgMusic = document.getElementById("bg-music");
  let isPlaying = false;

  // 🔊 พยายามเล่นอัตโนมัติเมื่อโหลดหน้า
  const tryAutoPlay = () => {
    bgMusic.play().then(() => {
      isPlaying = true;
      playBtn.textContent = "⏸️";
    }).catch(() => {
      console.log("Auto-play ถูกบล็อกโดยเบราว์เซอร์");
    });
  };

  tryAutoPlay();

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      playBtn.textContent = "▶️";
    } else {
      bgMusic.play();
      playBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
  });

  // OTP Logic
  const otpInputs = document.querySelectorAll(".otp-inputs input");
  const correctOTP = "180602"; // แก้ได้ตามต้องการ
  const secretContent = document.getElementById("secret-content");

  otpInputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
      const entered = Array.from(otpInputs).map((i) => i.value).join("");
      if (entered.length === 5) {
        if (entered === correctOTP) {
          secretContent.style.display = "block";
          showConfetti();
        } else {
          secretContent.style.display = "none";
        }
      }
    });
  });

  // 🎉 Confetti animation
  function showConfetti() {
    const canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);

    const confetti = canvas.getContext("2d");
    const pieces = Array.from({ length: 100 }, () => createPiece());

    function createPiece() {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        r: Math.random() * 6 + 4,
        d: Math.random() * 50 + 50,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        tilt: Math.random() * 10 - 10,
      };
    }

    function draw() {
      confetti.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        confetti.beginPath();
        confetti.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        confetti.fillStyle = p.color;
        confetti.fill();
      });
      update();
    }

    function update() {
      pieces.forEach((p) => {
        p.y += Math.cos(p.d) + 1 + p.r / 2;
        p.x += Math.sin(p.d);

        if (p.y > window.innerHeight) {
          p.y = 0;
          p.x = Math.random() * window.innerWidth;
        }
      });
    }

    function loop() {
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    // หายไปหลัง 5 วินาที
    setTimeout(() => {
      canvas.remove();
    }, 5000);
  }
});