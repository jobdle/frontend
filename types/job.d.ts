interface Job {
  category: {
    name: string;
    minWage: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
    color: string;
  };
  createdAt: string;
  deadline: string;
  detail: string;
  employee: [Employee];
  employeeId: [];
  fullname: string;
  location: string;
  status: string;
  title: string;
  updatedAt: string;
  userId: string;
  __v: 0;
  _id: string;
  pictureUrl: string[];
}

interface JobEditable {
  pictureUrl: string[];
  title: string;
  detail: string;
  category: {
    color: string;
    minWage: number;
    name: string;

  };
  location: string;
  deadline: string;
}
