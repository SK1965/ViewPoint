import title_generation from "@/lib/title_generate";



export async function GET(request: Request){
    const title  = await title_generation("I cheated on her. I fucked so many young girls had so many situationships.still now I have physically active with six girls.My girl is very good and i also love her. but I am getting tight pussies than her so I cant control my lust.Today she caught me while doing four-some me and other three girls. I thaught she also joins us but she is angry on me now.just now we completed our foursome hardcore sesision and now I am going to ask her sorry and do hardcore sex with her am I doing wrong?")

    return new Response(
        JSON.stringify({
          success: false,
          data: title,
          message: "something went wrong",
        }),
        {
          status: 200,
        }
      );
}