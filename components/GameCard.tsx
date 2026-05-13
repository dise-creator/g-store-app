"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import {
  type Game,
  getActiveDiscount,
  getDiscountedPrice,
} from "@/store/games";

import { useWishlistStore } from "@/store/useWishlist";
import { useGameModal } from "@/store/useGameModal";
import { useRegionStore, REGIONS } from "@/store/useRegion";

interface GameCardProps {
  game: Game;
  onSelect?: (game: Game) => void;
}

function GameCardComponent({ game, onSelect }: GameCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();

  const openModal = useGameModal((state) => state.openModal);

  const { region, getPrice } = useRegionStore();

  const [imgError, setImgError] = useState(false);

  const isFavorite = isInWishlist(game.id);

  const discount = getActiveDiscount(game);

  const hasDiscount = discount > 0;

  const basePrice = hasDiscount
    ? getDiscountedPrice(game)
    : game.price;

  const displayPrice = getPrice(basePrice);

  const originalDisplayPrice = getPrice(game.price);

  const currentRegion = REGIONS[region];

  const handleHeartClick = (
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    toggleItem(game);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(game);
    } else {
      openModal(game);
    }
  };

  return (
    <div
      className="
        group
        relative
        flex
        flex-col
        gap-2
        transform-gpu
        will-change-transform
      "
    >
      {/* CARD CLICK */}
      <button
        onClick={handleCardClick}
        type="button"
        className="
          absolute
          inset-0
          z-20
          w-full
          h-full
          cursor-pointer
          bg-transparent
          border-none
        "
        aria-label={`Открыть ${game.title}`}
      />

      {/* FAVORITE */}
      <button
        onClick={handleHeartClick}
        type="button"
        className="
          absolute
          top-2
          right-2
          z-30
          w-8
          h-8
          flex
          items-center
          justify-center
          rounded-lg
          bg-black/60
          border
          border-white/10
          text-white/50
          active:scale-90
          transition-transform
        "
      >
        <Heart
          size={15}
          className={
            isFavorite
              ? "fill-[#ff6b00] text-[#ff6b00]"
              : ""
          }
        />
      </button>

      {/* DISCOUNT */}
      {hasDiscount && (
        <div
          className="
            absolute
            top-2
            left-2
            z-30
            px-2
            py-1
            rounded-lg
            bg-red-500
          "
        >
          <span
            className="
              text-white
              font-black
              text-[10px]
              uppercase
            "
          >
            -{discount}%
          </span>
        </div>
      )}

      {/* REGION */}
      <div
        className={`
          absolute
          z-30
          flex
          items-center
          gap-1
          px-2
          py-1
          rounded-md
          bg-black/60
          border
          border-white/10
          ${
            hasDiscount
              ? "top-10 left-2"
              : "top-2 left-2"
          }
        `}
      >
        <span className="text-[10px]">
          {currentRegion.flag}
        </span>

        <span
          className="
            text-[8px]
            text-white/60
            font-black
            uppercase
          "
        >
          {currentRegion.code}
        </span>
      </div>

      {/* IMAGE */}
      <div
        className="
          relative
          aspect-[3/4]
          w-full
          overflow-hidden
          rounded-[1.4rem]
          border
          border-white/10
          bg-[#161618]
        "
      >
        {!imgError ? (
          <Image
            src={game.image}
            alt={game.title}
            fill
            priority={false}
            loading="lazy"
            quality={70}
            sizes="
              (max-width: 640px) 48vw,
              (max-width: 768px) 30vw,
              (max-width: 1024px) 22vw,
              16vw
            "
            className="
              object-cover
              object-top
              select-none
            "
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-[#161618]
            "
          >
            <span
              className="
                text-white/20
                text-xs
                font-black
                uppercase
              "
            >
              Нет фото
            </span>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-1 px-1">
        <h3
          className="
            font-michroma
            text-[8px]
            md:text-[10px]
            uppercase
            tracking-[0.12em]
            text-white/40
            truncate
          "
        >
          {game.title}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span
              className={`
                font-michroma
                text-base
                md:text-lg
                leading-none
                ${
                  hasDiscount
                    ? "text-red-400"
                    : "text-white"
                }
              `}
            >
              {displayPrice.toLocaleString()}
            </span>

            <span
              className={`
                font-michroma
                text-[10px]
                mt-1
                ${
                  hasDiscount
                    ? "text-red-400"
                    : "text-[#ff6b00]"
                }
              `}
            >
              ₽
            </span>
          </div>

          {hasDiscount && (
            <span
              className="
                font-michroma
                text-[10px]
                text-white/20
                line-through
                leading-none
                mt-1
              "
            >
              {originalDisplayPrice.toLocaleString()} ₽
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const GameCard = memo(GameCardComponent);

export default GameCard;