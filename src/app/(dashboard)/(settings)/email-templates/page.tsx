import React from "react";
import UserTable from "./_components/user-table";

export const dynamic = 'force-dynamic'

const UsersPage = () => {
  return (
    <div className="p-8">
      <UserTable />
    </div>
  );
};

export default UsersPage;