import { getOrCreateReviewCard } from "@/server/db/reviewCards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/review/$problemId")({
  component: RouteComponent,
  loader: ({ params }) => {
    return getOrCreateReviewCard(params.problemId);
  },
});

function RouteComponent() {
  const { problemId } = Route.useParams();
  const reviewCard = Route.useLoaderData();

  return (
    <div>
      <h2 className="capitalize">Problem: {problemId.split("-").join(" ")}</h2>
      <div>
        <h3>Rating</h3>
        <div className="flex flex-row gap-1">
          <div>Again</div>
          <div>Easy</div>
          <div>Good</div>
          <div>Hard</div>
        </div>
      </div>
    </div>
  );
}
