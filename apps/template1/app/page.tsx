import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline text-red-500">Hello World</h1>
      <Input />
      <Button variant="destructive">Click me</Button>
    </div>
  );
}
