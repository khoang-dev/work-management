\*Database

- User:
  {
  id: string;
  name: string;
  email: string;
  password: string;
  selectedTaskIds: string[];
  }
- Project:
  {  
  name: string;
  startDate: string;
  endDate: string;
  userId: string; //TODO: in the future
  }
- Task:
  {
  id: string;
  usedTime: HmTime; // unit: minute
  done: boolean;
  name: string;
  estimatedTime: HmTime; // unit: minute
  projectId: string | null;
  userId: string; //TODO: in the future
  }

* API endpoint

- /user

  - POST: create a new user

- /user/informaion:

  - GET: get user information by jwt
    Response:
    {
    id: "string",
    name: "string",
    }

- /project:
  - GET: get all projects
    Response:
    type Project =
    {
    name: string;
    startDate: string;
    endDate: string;
    }
    data: Project[]
  - POST: create a new project
  - PUT: update a project
  - DELETE: delete a project
- /task:

  - GET: get all tasks
    Response:
    {
    id: string;
    selected: boolean;
    usedTime: HmTime; // unit: minute
    done: boolean;
    name: string;
    estimatedTime: HmTime; // unit: minute
    projectId: string | null;
    }

- Thiết kế store sao cho tối ưu.
  Handle show task và project
