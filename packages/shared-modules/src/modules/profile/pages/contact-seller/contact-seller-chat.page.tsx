"use client";

import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { SupportSessionService } from "@repo/api/services/support-session/support-session.service";
import {
  ISupportMessage,
  ISupportSession,
  SupportSenderRole,
  SupportSessionStatus,
} from "@repo/api/services/support-session/support-session.interface";
import { UploadService } from "@repo/api/services/upload/upload.service";
import { getSupportSocket } from "@repo/api/socket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  ImageIcon,
  SendIcon,
  PackageIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  RefreshCwIcon,
  HelpCircleIcon,
} from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";
import { useUserContext } from "@repo/contexts/user-context/user.context";

interface IProps {
  sessionId: string;
}

export const ContactSellerChatPage = ({ sessionId }: IProps) => {
  const { shopId, locale } = useParams<ICommonParams>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("contact_seller");
  const { user } = useUserContext();

  const isNew = sessionId === "new";

  // Subject gate: shown before the chat when creating a new session
  const [subject, setSubject] = useState("");
  const [subjectConfirmed, setSubjectConfirmed] = useState(false);
  const showSubjectGate = isNew && !subjectConfirmed;

  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["support-messages", shopId, sessionId],
    queryFn: () => SupportSessionService.getMessages(shopId, sessionId),
    enabled: !isNew,
    refetchInterval: 10000,
  });

  const session: ISupportSession | undefined = data?.data.session;
  const messages: ISupportMessage[] = data?.data.messages ?? [];

  const sendMutation = useMutation({
    mutationFn: () =>
      SupportSessionService.sendMessage(shopId, {
        sessionId: isNew ? undefined : sessionId,
        subject: isNew ? subject.trim() : undefined,
        text: text.trim() || undefined,
        attachments: pendingImages.map((url) => ({
          url,
          type: "image" as const,
        })),
      }),
    onSuccess: (res) => {
      setText("");
      setPendingImages([]);
      if (isNew) {
        const newId = res.data.session._id;
        router.replace(`/${locale}/${shopId}/profile/contact-seller/${newId}`);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["support-messages", shopId, sessionId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["support-sessions", shopId] });
    },
  });

  useEffect(() => {
    if (isNew || !session) return;
    const socket = getSupportSocket();

    const join = () => socket.emit("session:join", session._id);
    if (socket.connected) join();
    socket.on("connect", join);

    const onNew = (payload: {
      sessionId: string;
      message: ISupportMessage;
    }) => {
      if (payload.sessionId !== session._id) return;
      queryClient.setQueryData(
        ["support-messages", shopId, sessionId],
        (
          old:
            | {
                data: { session: ISupportSession; messages: ISupportMessage[] };
              }
            | undefined,
        ) => {
          if (!old) return old;
          if (old.data.messages.find((m) => m._id === payload.message._id))
            return old;
          return {
            ...old,
            data: {
              ...old.data,
              messages: [...old.data.messages, payload.message],
            },
          };
        },
      );
    };

    const onUpdate = (payload: { session: ISupportSession }) => {
      if (!payload?.session) return;
      if (
        payload.session._id !== session._id &&
        String(payload.session._id) !== String(session._id)
      )
        return;
      queryClient.setQueryData(
        ["support-messages", shopId, sessionId],
        (
          old:
            | {
                data: { session: ISupportSession; messages: ISupportMessage[] };
              }
            | undefined,
        ) => {
          if (!old) return old;
          return { ...old, data: { ...old.data, session: payload.session } };
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["support-sessions", shopId],
      });
    };

    socket.on("message:new", onNew);
    socket.on("session:updated", onUpdate);
    socket.on("session:resolved", onUpdate);

    return () => {
      socket.emit("session:leave", session._id);
      socket.off("connect", join);
      socket.off("message:new", onNew);
      socket.off("session:updated", onUpdate);
      socket.off("session:resolved", onUpdate);
    };
  }, [isNew, session?._id, shopId, sessionId, queryClient]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const res = await UploadService.uploadImage(file);
      const url = res.data?.url;
      if (url) setPendingImages((prev) => [...prev, url]);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSend = () => {
    const hasText = text.trim().length > 0;
    const hasImages = pendingImages.length > 0;
    if (!hasText && !hasImages) return;
    if (isNew && !subject.trim()) return;
    sendMutation.mutate();
  };

  const isResolved = session?.status === SupportSessionStatus.Resolved;
  const myId = user?._id;

  const subjectTemplates = [
    { key: "subject_product", icon: PackageIcon },
    { key: "subject_payment", icon: CreditCardIcon },
    { key: "subject_quality", icon: ShieldCheckIcon },
    { key: "subject_delivery", icon: TruckIcon },
    { key: "subject_return", icon: RefreshCwIcon },
    { key: "subject_other", icon: HelpCircleIcon },
  ] as const;

  // ── Subject gate screen ──────────────────────────────────────────────────
  if (showSubjectGate) {
    return (
      <div className="flex-grow flex flex-col h-full">
        <PageHeader title={t("new_session")} />
        <div className="flex-grow flex flex-col px-4 pb-8 pt-4 max-w-md mx-auto w-full gap-4">
          <p className="text-sm text-muted-foreground">{t("subject_hint")}</p>
          <div className="grid grid-cols-2 gap-3">
            {subjectTemplates.map(({ key, icon: Icon }) => {
              const label = t(key);
              const selected = subject === label;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSubject(label)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-6 w-6 shrink-0" />
                  <span className="leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
          <Button
            disabled={!subject.trim()}
            onClick={() => setSubjectConfirmed(true)}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    );
  }

  // ── Chat screen ──────────────────────────────────────────────────────────
  return (
    <div className="flex-grow flex flex-col h-full">
      <PageHeader title={isNew ? subject : session?.subject || t("title")} />

      <div className="flex-grow flex flex-col px-4 pb-4 overflow-hidden">
        <div ref={listRef} className="flex-grow overflow-y-auto space-y-2 py-2">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            messages.map((m) => {
              const mine =
                m.senderRole === SupportSenderRole.Customer ||
                (myId != null && m.sender === myId);
              return (
                <div
                  key={m._id}
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm break-words",
                    mine
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted",
                  )}
                >
                  {m.text && <div>{m.text}</div>}
                  {m.attachments?.map((a, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={a.url}
                      alt="attachment"
                      className="mt-1 max-h-48 rounded"
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>

        {isResolved ? (
          <div className="border rounded-lg p-3 text-center bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">
              {t("session_resolved")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/${locale}/${shopId}/profile/contact-seller/new`)
              }
            >
              {t("start_new_session")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {pendingImages.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt="pending"
                    className="h-16 w-16 rounded object-cover"
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2 items-end">
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label={t("attach_image")}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("type_message")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={
                  sendMutation.isPending ||
                  (!text.trim() && pendingImages.length === 0)
                }
                aria-label={t("send")}
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
