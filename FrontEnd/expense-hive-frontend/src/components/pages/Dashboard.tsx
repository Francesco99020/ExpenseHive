import { useState } from "react";
import axios from "axios";
import GridLayout, { WidthProvider, Layout } from "react-grid-layout";
import AddExpensesModal from "../uiComponents/AddExpensesModal";
import EditCategoryModal from "../uiComponents/EditCategoryModal";
import EditExpensesModal from "../uiComponents/EditExpensesModal";
import AddCategoryModal from "../uiComponents/AddCategoryModal";
import SidePanelButton from "../uiComponents/SidePanelButton";
import ExpenseVisualization from "../uiComponents/ExpenseVisualization";
import ExpenseList from '../uiComponents/ExpenseList';
import { Expense } from '../../types/types';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const Dashboard: React.FC = () => {

  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [expensesToMatch, setExpensesToMatch] = useState<Expense[]>([]);
  const [isAddExpensesModalOpen, setIsAddExpensesModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const initialLayout: Layout[] = [
    { i: "savings", x: 0, y: 0, w: 3, h: 1, minW: 1, minH: 1 },
    { i: "overview", x: 0, y: 1, w: 3, h: 3, minW: 1, minH: 1 },
    { i: "summary", x: 3, y: 0, w: 1, h: 6, minW: 1, minH: 1 },
    { i: "income", x: 0, y: 3, w: 3, h: 2, minW: 1, minH: 1 },
  ];

  const [layout, setLayout] = useState(initialLayout);

   const handleToggleEditingMode = () => {
    setIsEditingMode(!isEditingMode);
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const handleOpenAddCategoryModal = () => {
      setIsAddCategoryModalOpen(true);
      if(isAddExpensesModalOpen) handleCloseAddExpensesModal()
      if(isEditCategoryModalOpen) handleCloseEditCategoryModal();
      if(isEditExpenseModalOpen) handleCloseEditExpenseModal();
  }

  const handleOpenEditExpenseModal = () => {
    setIsEditExpenseModalOpen(true);
    if(isAddExpensesModalOpen) handleCloseAddExpensesModal();
    if(isEditCategoryModalOpen) handleCloseEditCategoryModal();
    if(isAddCategoryModalOpen) handleCloseAddCategoryModal();
  }

  const handleOpenAddExpensesModal = () => {
      setIsAddExpensesModalOpen(true);
      if(isAddCategoryModalOpen) handleCloseAddCategoryModal();
      if(isEditCategoryModalOpen) handleCloseEditCategoryModal();
      if(isEditExpenseModalOpen) handleCloseEditExpenseModal();
  };

  const handleCloseAddCategoryModal = () => {
      setIsAddCategoryModalOpen(false);
      setSelectedButton(null);
  }

  const handleCloseAddExpensesModal = () => {
      setIsAddExpensesModalOpen(false);
      setSelectedButton(null);
  }

  const handleCloseEditExpenseModal = () => {
    setIsEditExpenseModalOpen(false);
    setSelectedButton(null);
  }

  const handleOpenEditCategoryModal = () => {
      setIsEditCategoryModalOpen(true);
      if(isEditExpenseModalOpen) handleCloseEditExpenseModal();
      if(isAddCategoryModalOpen) handleCloseAddCategoryModal();
      if(isAddExpensesModalOpen) handleCloseAddExpensesModal();
  }

  const handleCloseEditCategoryModal = () => {
      setIsEditCategoryModalOpen(false);
      setSelectedButton(null);
  }

  const handleSubmitAddExpenses = async (formData: any) => {
      try {
        console.log(formData);
          await axios.post(
              'http://localhost:3001/api/expenseTracking/addExpenses',
              {
                  account: localStorage.getItem('account'),
                  expenses: formData
              },
              {
                  headers: {
                      authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                  }
              }
          ).then(() => {
            console.log('Do stuff with the data');
          });
        
      } catch (error) {
          console.error('Error adding expenses:', error);
      }
  };

  const handleSubmitAddCategorys = async (formData: any) => {
    try {
      await axios.post(
          'http://localhost:3001/api/expenseTracking/addCategories',
          {
              account: localStorage.getItem('account'),
              categories: formData
          },
          {
              headers: {
                  authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
              }
          }
      ).then((response) => {
        console.log(response);
      });

    } catch (error) {
        console.error('Error adding categories:', error);
    }
  }

  const handleSubmitEditCategorys = async (modifiedCategories: any, deletedCategories: string[]) => {
    try {
        // Execute the PUT request for modified categories if there are any
        if (modifiedCategories.length > 0) {
            await axios.put(
                'http://localhost:3001/api/expenseTracking/updateCategories',
                {
                    modifiedCategories: modifiedCategories
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then((response) => {
                console.log('Modified categories response:', response);
            });
        }

        // Execute the DELETE request for deleted categories if there are any
        if (deletedCategories.length > 0) {
            await axios.delete(
                'http://localhost:3001/api/expenseTracking/deleteCategories',
                {
                    data: { deletedCategories: deletedCategories },
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then((response) => {
                console.log('Deleted categories response:', response);
            });
        }

    } catch (error) {
        console.error('Error updating categories:', error);
    }
  };

  const handleSubmitEditExpenses = async (modifiedExpenses: any, deletedExpenses: string[]) => {
  try {
      // Execute the PUT request for modified expenses if there are any
      if (modifiedExpenses.length > 0) {
          await axios.put(
              'http://localhost:3001/api/expenseTracking/updateExpenses',
              {
                  modifiedExpenses: modifiedExpenses
              },
              {
                  headers: {
                      authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                  }
              }
          ).then((response) => {
              console.log('Modified expenses response:', response);
          });
      }

      // Execute the DELETE request for deleted expenses if there are any
      if (deletedExpenses.length > 0) {
          await axios.delete(
              'http://localhost:3001/api/expenseTracking/deleteExpenses',
              {
                  data: { deletedExpenses: deletedExpenses },
                  headers: {
                      authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                  }
              }
          ).then((response) => {
              console.log('Deleted expenses response:', response);
          });
      }

  } catch (error) {
      console.error('Error updating expenses:', error);
  }
  };

  const handleButtonClick = (name: string) => {
      setSelectedButton(name);
  }

  return (
    <div className="flex h-screen bg-bright-yellow overflow-x-hidden">
      {/* Modals */}
      <AddExpensesModal isOpen={isAddExpensesModalOpen} onClose={handleCloseAddExpensesModal} onSubmit={handleSubmitAddExpenses} />
      <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={handleCloseAddCategoryModal} onSubmit={handleSubmitAddCategorys} />
      <EditCategoryModal isOpen={isEditCategoryModalOpen} onClose={handleCloseEditCategoryModal} onSubmit={handleSubmitEditCategorys} />
      <EditExpensesModal isOpen={isEditExpenseModalOpen} onClose={handleCloseEditExpenseModal} onSubmit={handleSubmitEditExpenses} />
      
      {/* Sticky Side Panel */}
      <div className="w-fit h-full bg-dark-yellow p-4 flex flex-col items-center sticky top-0">
        <h2 className="text-light-brown font-bold text-center mb-6">Expense Hive</h2>
  
        <SidePanelButton
          name="Add Expense"
          isSelected={selectedButton === 'Add Expense'}
          onClick={() => {
            handleButtonClick('Add Expense');
            handleOpenAddExpensesModal();
          }}
        />
  
        <SidePanelButton 
          name="Add Category"
          isSelected={selectedButton === 'Add Category'}
          onClick={() => {
            handleOpenAddCategoryModal();
            handleButtonClick('Add Category');
          }}
        />
  
        <SidePanelButton
          name="Add Income"
          isSelected={selectedButton === 'Add Income'}
          onClick={() => {
            //handleOpenEditCategoryModalOpen();
            handleButtonClick('Add Income');
          }}
        />
  
        <SidePanelButton
          name="Edit Expense"
          isSelected={selectedButton === 'Edit Expense'}
          onClick={() => {
            handleOpenEditExpenseModal();
            handleButtonClick('Edit Expense');
          }}
        />
  
        <SidePanelButton
          name="Edit Category"
          isSelected={selectedButton === 'Edit Category'}
          onClick={() => {
            handleOpenEditCategoryModal();
            handleButtonClick('Edit Category');
          }}
        />
  
        <SidePanelButton
          name="Edit Income"
          isSelected={selectedButton === 'Edit Income'}
          onClick={() => {
            //handleOpenEditCategoryModalOpen();
            handleButtonClick('Edit Income');
          }}
        />
  
        {/* Toggle for Editing Mode */}
        <button onClick={handleToggleEditingMode} className="mt-4 p-2 bg-light-brown text-dark-yellow rounded">
          {isEditingMode ? "Disable Editing Mode" : "Enable Editing Mode"}
        </button>
      </div>
  
      {/* Dynamic Grid */}
      <div className="flex-1 p-4">
        <ResponsiveGridLayout
          className="h-full"
          layout={layout}
          onLayoutChange={handleLayoutChange}
          cols={4}
          rowHeight={150}
          isDraggable={isEditingMode}  // Enable dragging only in editing mode
          isResizable={isEditingMode}  // Enable resizing only in editing mode
          margin={[10, 10]} // Spacing between grid items
        >
          <div key="savings" className="bg-dark-yellow p-4 border-4 border-[#cc5d00] rounded-lg">
            <h3 className="text-light-brown font-bold">My Savings</h3>
          </div>
  
          <div key="overview" className="bg-dark-yellow p-4 border-4 border-[#cc5d00] rounded-lg">
            <ExpenseVisualization onExpensesChange={setExpensesToMatch} />
          </div>
  
          <div key="summary" className="bg-dark-yellow p-4 border-4 border-[#cc5d00] rounded-lg">
            <h3 className="text-light-brown font-bold">My Summary</h3>
            <ExpenseList expensesToMatch={expensesToMatch} />
          </div>
  
          <div key="income" className="bg-dark-yellow p-4 border-4 border-[#cc5d00] rounded-lg">
            <h3 className="text-light-brown font-bold">My Income Tracking</h3>
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );  
}

export default Dashboard;