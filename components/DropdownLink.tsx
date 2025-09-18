import Link from "next/link";
import React from "react";

function DropdownLink(props: any) {
  const { href, logout, children } = props;

  return (
    <Link
      className="flex hover:bg-gray-300 p-2 rounded-t-sm rounded-b-sm "
      href={href}
      onClick={() => {
        if (logout) logout();
      }}
    >
      {children}
    </Link>
  );
}

export default DropdownLink;
