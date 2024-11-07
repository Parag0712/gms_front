// /app/project/page.jsx
import Link from 'next/link';

const ProjectListPage = () => {
  const projects = [
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
    // Add more projects as needed
  ];

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}/invoice`}>
              {project.name} - View Invoice
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectListPage;
