import React, { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { cards } from "./data/cards";
import "./App.css";

export default function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | "">("");
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  // Track zoom level and image offset
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    resetZoom();
  };

  const goPrev = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    resetZoom();
  };

  const goNext = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      if (prev === 2) return 2.5;
      return 1; // back to normal
    });
    setOffset({ x: 0, y: 0 });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => zoomLevel === 1 && goNext(),
    onSwipedRight: () => zoomLevel === 1 && goPrev(),
    trackMouse: true,
  });

  // Start dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomLevel === 1) return;
    startRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    setDragging(true);
  };

  // Global pointer move/up listeners
  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (zoomLevel === 1 || !startRef.current) return;
      e.preventDefault();
      setOffset({
        x: e.clientX - startRef.current.x,
        y: e.clientY - startRef.current.y,
      });
    };

    const endDrag = () => {
      setDragging(false);
      startRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [dragging, zoomLevel]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="app">
      <header style={{ textAlign: "center" }}>
        <img
          src="src/img/logo.png"
          alt="Site Logo"
          style={{
            width: "500px",
            height: "auto",
            marginTop: "-20px",
            marginBottom: "-20px",
          }}
        />
        <p className="header-text">
          Click on the card to see each cards individually and more clearly
        </p>
        <p className="header-text jp">
          カードをクリックすると、それぞれを個別に、よりはっきり見ることができます
        </p>
      </header>

      <div className="card-grid">
        {cards.map((card: any, index: any) => (
          <img
            key={card.id}
            src={card.image}
            alt={`Anniversary card ${card.id}`}
            className="card-img"
            loading="lazy"
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" {...handlers}>
          <button className="close-btn" onClick={closeLightbox}>
            ✕
          </button>
          <button className="prev-btn" onClick={goPrev}>
            ‹
          </button>

          <div
            className="lightbox-img-wrapper"
            onPointerDown={handlePointerDown}
            style={{ touchAction: zoomLevel > 1 ? "none" : "auto" }}
          >
            <img
              key={currentIndex}
              src={cards[currentIndex].image}
              alt={`Card ${cards[currentIndex].id}`}
              className={`lightbox-img slide-${direction}`}
              draggable={false}
              style={{
                maxWidth: "90%",
                maxHeight: "80vh",
                objectFit: "contain",
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomLevel})`,
                transition: dragging ? "none" : "transform 0.3s ease",
                cursor: zoomLevel > 1 ? (dragging ? "grabbing" : "grab") : "default",
              }}
            />
          </div>

          <button className="next-btn" onClick={goNext}>
            ›
          </button>
          <button className="zoom-btn" onClick={toggleZoom}>
            {zoomLevel === 1
              ? "🔍1x"
              : zoomLevel === 1.5
              ? "🔍1.5x"
              : zoomLevel === 2
              ? "🔍2x"
              : "🔍2.5x"}
          </button>
        </div>
      )}

      <footer className="credits">
        <h2 className="credits-title"><strong><u>クレジット / Credits</u></strong></h2>

        <div className="credit-section">
          <h3>
            <strong>Management, Message editing/compiling, Website development / 運営、メッセージ編集、ウェブサイト開発</strong>
          </h3>
          <p>TuckHoe</p>
          <h3>
            <strong>Card layout designer / カードレイアウトデザイナー</strong>
          </h3>
          <p>tan-45 𝕏 @tan_n45</p>
        </div>

        <div className="credit-thanks">
          <h3>
            <strong>Special thanks to all the Hisyominarais who sent in their submissions / 投稿してくれた全ての秘書見習いたちに感謝</strong>
          </h3>
          <p>
            TuckHoe, Ookamisan, Pozo, Slash, kellanmcallen, おーりんさん, はとさぶれさん, megami011, BrickBoss, Yoonseha, Cheezebearger, sheep sheep
          </p>
          <p>
            Misonova, Min, 限界秘書ベルルンさん, 響でむぺさん, ルナリアさん, KiyouraS, Eli, ぺいとちゃん月*ルナ*@一条Corpデザイン部さん, Amby, Dun Gouf’d
          </p>
          <p>
            shookbykemp, Nalds, D51, アイニキテさん, Rumi, 설일별(ソル)さん, えるさん, steelballさん, うぃきっどさん, FN LN, Lilyさん, ダルさん, Rattled
          </p>
        </div>
      </footer>

      {!lightboxOpen && (
        <div className="scroll-buttons">
          <button onClick={scrollToTop} className="scroll-btn">⬆ Top / 上へ</button>
          <button onClick={scrollToBottom} className="scroll-btn">⬇ Bottom / 下へ</button>
        </div>
      )}
    </div>
  );
}