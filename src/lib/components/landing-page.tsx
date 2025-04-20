import CreateExpenseForm from "@/lib/components/create-expense-form";
import Dashboard from "@/lib/components/dashboard";
import { ExpenseList } from "@/lib/components/expense-list";
import CreateExpenseModal from "@/lib/components/modals/create-expense-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";

const LandingPage = () => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Road Trip Expense Tracker</h1>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
          <TabsTrigger value="expense-list">Expense List</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="w-full">
          <Dashboard />
        </TabsContent>
        <TabsContent value="add-expense">
          <CreateExpenseForm />
        </TabsContent>
        <TabsContent value="expense-list">
          <ExpenseList />
        </TabsContent>
      </Tabs>

      <div className="absolute bottom-8 right-8">
        <CreateExpenseModal triggerType="circle" />
      </div>
    </div>
  );
};

export default LandingPage;
