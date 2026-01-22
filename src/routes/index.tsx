import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { getAllCards } from "@/server/db/reviewCards.ts";
export const Route = createFileRoute("/")({
  component: App,
  loader: () => getAllCards(),
});

function App() {
  const navigate = useNavigate();
  const cards = Route.useLoaderData();

  function startReview(problemId: string) {
    navigate({ to: `/review/${problemId}` });
  }

  return (
    <div>
      <h1>Available Problems</h1>
      <div>
        {cards.map((card) => (
          <div key={card.problemId}>
            <span className="capitalize">
              {card.problemNumber}: {card.problemId.split("-").join(" ")}{" "}
            </span>
            <button
              className="hover:text-red-600"
              onClick={() => startReview(card.problemId)}
            >
              Review
            </button>
            <Link
              to="/review/$problemId"
              params={{ problemId: card.problemId }}
            >
              Review2
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
