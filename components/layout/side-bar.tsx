import { TChatSession } from "@/types";
import { Button, Flex, Tooltip, Type } from "@/ui";
import Avvvatars from "avvvatars-react";
import {
  Command,
  LogInIcon,
  LogOut,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { FullPageLoader } from "../full-page-loader";
import { HistoryItem } from "../history/history-item";
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession()
  const user = session?.user

  useEffect(() => {
    // if(!session?.user?.email){
    //   toast.error("Please login to view chats")
    // }
    console.log('session', session)
    console.log('user', user)
  }, [session, user]);

  const groupedSessions: Record<string, TChatSession[]> = {
    examples: [],
    today: [],
    tomorrow: [],
    last7Days: [],
    last30Days: [],
    previousMonths: [],
  };

  const renderGroup = (title: string, sessions: TChatSession[]) => {
    if (sessions.length === 0) return null;
    return (
      <Flex gap="xs" direction="col" items="start" className="w-full">
        <Type size="xs" weight="medium" className="px-2">
          {title}
        </Type>
        <Flex className="w-full" gap="xs" direction="col">
          {sessions.map((session) => (
            <HistoryItem
              session={session}
              key={session.id}
              dismiss={() => { }}
            />
          ))}
        </Flex>
      </Flex>
    );
  };

  return (
    <div className="relative flex h-[100dvh] w-[260px] flex-shrink-0 flex-row border-l border-zinc-500/10">
      <Flex direction="col" gap="xl" className="no-scrollbar w-full pl-3 pr-1">
        <Flex
          justify="between"
          items="center"
          direction="col"
          className="w-full pb-2 pt-4"
          gap="sm"
        >
          <Tooltip content="Coming Soon!">
            <Button
              size="sm"
              className="w-full"
              disabled={true}
            >
              <Plus size={14} strokeWidth={2} /> New Chat
            </Button>
          </Tooltip>
          <Tooltip content="Coming Soon!">
            <Button
              size="sm"
              variant="bordered"
              className="w-full gap-2"
            // onClick={() => setIsCommandSearchOpen(true)}
            >
              <Search size={14} strokeWidth={2} /> Search
              <Flex items="center" gap="xs">
                <Command size={12} /> K
              </Flex>
            </Button>
          </Tooltip>

          {/* <Button
            variant={isAssistantPage ? "secondary" : "ghost"}
            className="w-full justify-start gap-2 px-2"
            onClick={() => {
              push("/assistants");
            }}
          >
            <ModelIcon type="assistants" size="sm" />
            Explore Assistants
          </Button> */}
        </Flex>

        {false ? (
          <FullPageLoader />
        ) : (
          <Flex
            direction="col"
            gap="xl"
            className="no-scrollbar w-full flex-1 overflow-y-auto"
          >
            {renderGroup("Examples", groupedSessions.examples)}
            {renderGroup("Today", groupedSessions.today)}
            {renderGroup("Tomorrow", groupedSessions.tomorrow)}
            {renderGroup("Last 7 Days", groupedSessions.last7Days)}
            {renderGroup("Last 30 Days", groupedSessions.last30Days)}
            {renderGroup("Previous Months", groupedSessions.previousMonths)}
          </Flex>
        )}
        <Flex
          className="w-full bg-zinc-50 py-3 dark:bg-zinc-900"
          direction="col"
          gap="sm"
        >
          {!user ? (
            <Button
              size="md"
              variant="secondary"
              className="w-full gap-2"
              onClick={() => signIn('google')}
            >
              <LogInIcon size={20} strokeWidth={2} />
              SignIn{" "}
            </Button>
          ) : (
            <Flex
              gap="sm"
              items="center"
              className="w-full rounded-lg border border-zinc-500/20 bg-white p-1 dark:bg-zinc-800"
            >
              <Avvvatars value={user.name || "Anonymous"} size={24} />
              <Type size="xs" className="line-clamp-1 flex-grow">
                {user.name}
              </Type>
              <Tooltip content="Sign Out">
                <Button size="icon-xs" variant="ghost"
                  onClick={() => signOut()}
                >
                  <LogOut size={14} strokeWidth={2} />
                </Button>
              </Tooltip>
            </Flex>
          )}

          {/* <Flex gap="sm" className="w-full">
            <Button
              variant="bordered"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                setOpenApiKeyModal(true);
              }}
            >
              <KeyRound size={16} strokeWidth={2} />
              Add API
            </Button>
            <Button
              variant="bordered"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                push("/settings");
              }}
            >
              <Bolt size={16} strokeWidth={2} />
              Settings
            </Button>
          </Flex> */}
          <Flex className="w-full items-center justify-between opacity-70">
            <Flex gap="xs">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </Button>

              {/* <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => {
                  window.open("https://git.new/llmchat", "_blank");
                }}
              >
                <BsGithub size={14} />
              </Button> */}
              {/* <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => {
                  window.open("https://x.com/llmchatOS", "_blank");
                }}
              >
                <BsTwitter size={14} />
              </Button> */}
            </Flex>
            {/* <Type
              size="xs"
              weight="medium"
              textColor="secondary"
              className="px-1"
            >
              v {configs.version}
            </Type> */}
          </Flex>
        </Flex>
      </Flex>
      <ToastContainer />
    </div>
  );
};
