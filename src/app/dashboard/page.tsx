import { getSession } from "@/lib/auth/session";
import { Dashboard } from "@/components/dashboard";
import ExpenseForm from "@/components/create-expense-form";
import { ExpenseList } from "@/components/expense-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Road Trip Expense Tracker</h1>
          <p>Please sign in to view your expenses.</p>
          <Link href="/sign-in" className={buttonVariants()}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Road Trip Expense Tracker
      </h1>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
          <TabsTrigger value="expense-list">Expense List</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        <TabsContent value="add-expense">
          <ExpenseForm />
        </TabsContent>
        <TabsContent value="expense-list">
          <ExpenseList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
