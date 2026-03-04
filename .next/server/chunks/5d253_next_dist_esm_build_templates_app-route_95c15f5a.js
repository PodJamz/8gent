module.exports=[215781,e=>{"use strict";var t=e.i(457375),r=e.i(174015),n=e.i(116384),o=e.i(63831),s=e.i(868001),i=e.i(842780),a=e.i(763077),l=e.i(502964),c=e.i(993216),d=e.i(783900),u=e.i(295731),p=e.i(726839),h=e.i(775778),g=e.i(40992),m=e.i(432128),f=e.i(193695);e.i(44807);var y=e.i(989978),v=e.i(39334),b=e.i(488782);e.i(592251);let w=new(e.i(397497)).default,x=`You are an expert product analyst reviewing a discovery call transcript between James (a creative technologist) and a potential client.

Your task is to extract structured insights from this conversation that will be used to generate:
1. A Product Requirements Document (PRD)
2. Epics for the project backlog
3. User stories with acceptance criteria

## Extraction Guidelines

### Problem Understanding
- Identify the core problem being discussed
- Rate its severity based on how the client describes impact
- Look for root causes mentioned, not just symptoms
- Note any "aha moments" where the real problem emerged

### User Analysis
- Identify distinct user personas mentioned
- Capture their specific needs and pain points
- Note how they currently solve the problem
- Look for Jobs to be Done patterns (what are they trying to accomplish?)

### Feature Discovery
- List all features/capabilities mentioned
- Classify priority using MoSCoW (Must/Should/Could/Won't)
- Extract user stories in "As a [user] I want [capability] so that [benefit]" format
- Note any acceptance criteria mentioned

### Constraints
- Timeline pressures
- Budget indicators
- Technical requirements or preferences
- Integration needs
- Compliance/regulatory requirements

### Stakeholders
- Who else cares about this project?
- Who makes the budget decision?
- Who will be affected by the solution?

### Client Quotes
- Capture verbatim quotes that reveal key insights
- These add authenticity to the PRD
- Tag each quote with what it reveals (problem, user, solution, constraint)

### Confidence Assessment
- Rate your confidence (0-1) based on how complete the discovery was
- Note what follow-up questions would help clarify unknowns
- Suggest areas that need more exploration

## Output Format

Return a JSON object matching the DiscoveryInsights interface exactly. Be thorough but realistic - if something wasn't discussed, don't invent it. Mark fields as undefined if not covered.`;async function R(e,t){let r=e.map(e=>{let t="assistant"===e.role?"James":"Client";return`[${t}]: ${e.content}`}).join("\n\n"),n=(await w.messages.create({model:"claude-sonnet-4-20250514",max_tokens:8192,system:x,messages:[{role:"user",content:`Please analyze this discovery call transcript and extract structured insights.

## Call Information
- Duration: ${Math.floor(t/60)} minutes ${t%60} seconds
- Total exchanges: ${e.length}

## Transcript

${r}

## Instructions

Extract insights following the guidelines. Return ONLY valid JSON matching this TypeScript interface:

\`\`\`typescript
interface DiscoveryInsights {
  problemStatement: string;
  problemSeverity: 'critical' | 'significant' | 'moderate' | 'nice-to-have';
  rootCause?: string;

  targetUsers: Array<{
    persona: string;
    description: string;
    needs: string[];
    painPoints: string[];
    currentSolution?: string;
  }>;

  desiredOutcomes: Array<{
    outcome: string;
    metric?: string;
    priority: 'must' | 'should' | 'could';
  }>;

  requestedFeatures: Array<{
    name: string;
    description: string;
    priority: 'must' | 'should' | 'could' | 'wont';
    userStory?: string;
    acceptanceCriteria?: string[];
  }>;

  constraints: {
    timeline?: string;
    budget?: string;
    techStack?: string[];
    integrations?: string[];
    compliance?: string[];
    teamSize?: string;
    existingSystems?: string[];
  };

  stakeholders: Array<{
    role: string;
    interest: string;
    influence: 'high' | 'medium' | 'low';
  }>;

  risksAndUnknowns: Array<{
    item: string;
    severity: 'high' | 'medium' | 'low';
    mitigation?: string;
  }>;

  clientQuotes: Array<{
    quote: string;
    context: string;
    relevance: 'problem' | 'user' | 'solution' | 'constraint';
  }>;

  projectName?: string;
  callDuration: number;
  confidenceScore: number;
  suggestedFollowUps: string[];
}
\`\`\`

Return ONLY the JSON object, no markdown code blocks or explanation.`}]})).content[0];if("text"!==n.type)throw Error("Unexpected response type from Claude");let o=n.text.trim();o.startsWith("```json")?o=o.slice(7):o.startsWith("```")&&(o=o.slice(3)),o.endsWith("```")&&(o=o.slice(0,-3)),o=o.trim();try{let e=JSON.parse(o);return e.callDuration=t,function(e){if(!e.problemStatement)throw Error("Missing required field: problemStatement");if(!e.problemSeverity)throw Error("Missing required field: problemSeverity");if(!Array.isArray(e.targetUsers)||0===e.targetUsers.length)throw Error("Missing or empty required field: targetUsers");Array.isArray(e.desiredOutcomes)||(e.desiredOutcomes=[]),Array.isArray(e.requestedFeatures)||(e.requestedFeatures=[]),e.constraints||(e.constraints={}),Array.isArray(e.stakeholders)||(e.stakeholders=[]),Array.isArray(e.risksAndUnknowns)||(e.risksAndUnknowns=[]),Array.isArray(e.clientQuotes)||(e.clientQuotes=[]),"number"!=typeof e.confidenceScore&&(e.confidenceScore=.5),Array.isArray(e.suggestedFollowUps)||(e.suggestedFollowUps=[])}(e),e}catch(e){throw console.error("[TranscriptProcessor] Failed to parse insights JSON:",e),console.error("[TranscriptProcessor] Raw response:",n.text),Error(`Failed to parse transcript insights: ${e instanceof Error?e.message:"Unknown error"}`)}}async function k(e,t){let r=new b.ConvexHttpClient(t.convexUrl),n=await $(r,e,t.ownerId),o=await C(r,n,e),s=await S(r,n,o,e),i=await E(r,n,s,e);return{projectId:n,prdId:o,epicIds:s,ticketIds:i}}async function $(e,t,r){let n=t.projectName||"Untitled Discovery Project";return(await e.mutation(b.api.agentic.createProductProject,{name:n,description:t.problemStatement,ownerId:r})).projectId}async function C(e,t,r){var n,o;let s,i,a,l,c,d,u,p,h,g=(s=(n=r).targetUsers.length,i=n.requestedFeatures.filter(e=>"must"===e.priority).length,a=`This project addresses ${n.problemSeverity} pain points for ${s} user persona${s>1?"s":""}.

**Core Problem:** ${n.problemStatement}

**Key Outcomes:**
${n.desiredOutcomes.slice(0,3).map(e=>`- ${e.outcome}`).join("\n")}

**MVP Scope:** ${i} must-have features identified during discovery.

**Confidence:** ${Math.round(100*n.confidenceScore)}% based on discovery call coverage.

---

## Target Users

`+n.targetUsers.map(e=>{let t=`### ${e.persona}

${e.description}

`;return t+=`**Needs:**
${e.needs.map(e=>`- ${e}`).join("\n")}

**Pain Points:**
${e.painPoints.map(e=>`- ${e}`).join("\n")}`,e.currentSolution&&(t+=`

**Current Solution:** ${e.currentSolution}`),t}).join("\n\n---\n\n"),l=n.requestedFeatures.filter(e=>"must"===e.priority),c=n.requestedFeatures.filter(e=>"should"===e.priority),a+="\n\n---\n\n## MVP Scope\n\n### Must-Have Features\n\n",a+=l.map(e=>`- **${e.name}**: ${e.description}`).join("\n"),c.length>0&&(a+="\n\n### Should-Have Features (Post-MVP)\n\n",a+=c.map(e=>`- **${e.name}**: ${e.description}`).join("\n")),d=n.constraints,u=[],d.timeline&&u.push(`**Timeline:** ${d.timeline}`),d.budget&&u.push(`**Budget:** ${d.budget}`),d.teamSize&&u.push(`**Team:** ${d.teamSize}`),d.techStack?.length&&u.push(`**Technology:** ${d.techStack.join(", ")}`),d.integrations?.length&&u.push(`**Integrations:** ${d.integrations.join(", ")}`),d.compliance?.length&&u.push(`**Compliance:** ${d.compliance.join(", ")}`),u.length>0&&(a+="\n\n---\n\n## Constraints\n\n",a+=u.join("\n\n")),n.risksAndUnknowns.length>0&&(a+="\n\n---\n\n## Risks & Unknowns\n\n",a+=n.risksAndUnknowns.map(e=>{let t=`- **${e.item}** (${e.severity} severity)`;return e.mitigation&&(t+=`
  - Mitigation: ${e.mitigation}`),t}).join("\n")),n.clientQuotes.length>0&&(a+="\n\n---\n\n## Client Quotes\n\n",a+=n.clientQuotes.map(e=>`> "${e.quote}"
> — ${e.context}`).join("\n\n")),n.suggestedFollowUps.length>0&&(a+="\n\n---\n\n## Suggested Follow-ups\n\n",a+=n.suggestedFollowUps.map(e=>`- ${e}`).join("\n")),a),m=(p=(o=r).problemStatement,o.rootCause&&(p+=`

**Root Cause:** ${o.rootCause}`),(h=o.clientQuotes.filter(e=>"problem"===e.relevance)).length>0&&(p+="\n\n**In the client's words:**\n",p+=h.slice(0,2).map(e=>`> "${e.quote}"
> — ${e.context}`).join("\n\n")),p);return(await e.mutation(b.api.agentic.createPRD,{projectId:t,title:`${r.projectName||"Project"} - Product Requirements`,executiveSummary:g,problemStatement:m,generatedBy:"ai",aiModel:"claude-sonnet-4-20250514"})).prdId}async function S(e,t,r,n){let o=P(n),s=[];for(let n of o){let o=await e.mutation(b.api.agentic.createEpic,{projectId:t,prdId:r,title:n.title,description:n.description,goal:n.goal,linkedFRs:n.linkedFRs});s.push(o.epicId)}return s}async function E(e,t,r,n){let o=[],s=P(n);for(let i=0;i<s.length&&i<r.length;i++){let a=s[i],l=r[i];for(let r of a.features){let s=n.targetUsers[0]?.persona||"user",i=r.userStory||`be able to ${r.name.toLowerCase()}`,a=function(e,t){let r=t.desiredOutcomes.find(t=>t.outcome.toLowerCase().includes(e.name.toLowerCase()));return r?r.outcome:`address the challenge of ${t.problemStatement.slice(0,50).toLowerCase()}...`}(r,n),c=function(e,t){return e.acceptanceCriteria&&e.acceptanceCriteria.length>0?e.acceptanceCriteria.map(r=>({given:`the ${t.targetUsers[0]?.persona||"user"} is using the system`,when:`they interact with ${e.name}`,then:r})):[{given:`a ${t.targetUsers[0]?.persona||"user"} is logged in`,when:`they access the ${e.name} feature`,then:`they can ${e.description.toLowerCase()}`}]}(r,n),d=await e.mutation(b.api.agentic.createTicket,{projectId:t,epicId:l,title:r.name,description:r.description,asA:s,iWant:i,soThat:a,acceptanceCriteria:c,type:"story",priority:function(e){switch(e){case"must":return"P0";case"should":return"P1";case"could":return"P2";default:return"P3"}}(r.priority),status:"backlog",labels:[r.priority,"discovery-generated"],storyPoints:function(e){let t=e.description.length,r=e.acceptanceCriteria?.length||0;return"must"===e.priority?t>100||r>3?8:5:"should"===e.priority?t>100||r>3?5:3:t>100?3:2}(r),createdBy:"ai"});o.push(d._id)}}return o}function P(e){let t=e.requestedFeatures.filter(e=>"must"===e.priority),r=e.requestedFeatures.filter(e=>"should"===e.priority),n=e.requestedFeatures.filter(e=>"could"===e.priority),o=[];return t.length>0&&o.push({title:"Core MVP Features",description:`Essential features required for initial launch. These address the primary problem: ${e.problemStatement.slice(0,100)}...`,goal:"Deliver minimum viable product that solves the core problem",linkedFRs:t.map(e=>`FR-${e.name.replace(/\s+/g,"-").toUpperCase()}`),features:t}),r.length>0&&o.push({title:"Enhanced Experience",description:"Features that significantly improve user experience and should be included if timeline permits.",goal:"Elevate the product beyond MVP to provide a polished experience",linkedFRs:r.map(e=>`FR-${e.name.replace(/\s+/g,"-").toUpperCase()}`),features:r}),n.length>0&&o.push({title:"Nice-to-Have Enhancements",description:"Features that would add value but are not critical for launch.",goal:"Add polish and delight to the core experience",linkedFRs:n.map(e=>`FR-${e.name.replace(/\s+/g,"-").toUpperCase()}`),features:n}),o}async function A(e,t){let r=new b.ConvexHttpClient(t.convexUrl);try{let n,o,s,i,a,l=await r.query(b.api.discovery.getSession,{sessionId:e});if(!l)throw Error(`Session ${e} not found`);console.log(`[DiscoveryOrchestrator] Processing session ${e}`),console.log(`[DiscoveryOrchestrator] Transcript length: ${l.transcript.length} entries`),console.log(`[DiscoveryOrchestrator] Duration: ${l.duration||0} seconds`),console.log("[DiscoveryOrchestrator] Starting transcript processing...");let c=await R(l.transcript,l.duration||0),d=(n={},o=[],n.problem=c.problemStatement.length>50?20:10,c.rootCause&&(n.problem+=5),n.problem<20&&o.push("Dig deeper into the root cause of the problem"),n.users=Math.min(10*c.targetUsers.length,20),n.users<20&&o.push("Identify more distinct user personas"),n.features=Math.min(5*c.requestedFeatures.filter(e=>"must"===e.priority).length,20),n.features<15&&o.push("Clarify must-have features for MVP"),n.constraints=Math.min(3*Object.values(c.constraints).filter(Boolean).length,15),c.constraints.timeline||o.push("Establish timeline expectations"),n.stakeholders=Math.min(3*c.stakeholders.length,10),n.stakeholders<6&&o.push("Identify decision makers and influencers"),n.quotes=Math.min(2*c.clientQuotes.length,10),n.quotes<6&&o.push("Capture more verbatim client quotes for the PRD"),n.risks=Math.min(2*c.risksAndUnknowns.length,5),{score:s=Object.values(n).reduce((e,t)=>e+t,0),breakdown:n,recommendations:s<70?o:[]});console.log(`[DiscoveryOrchestrator] Quality score: ${d.score}/100`),d.recommendations.length>0&&console.log("[DiscoveryOrchestrator] Recommendations:",d.recommendations),await r.mutation(b.api.discovery.storeInsights,{sessionId:e,insights:JSON.stringify(c)}),console.log("[DiscoveryOrchestrator] Generating BMAD artifacts...");let u=await k(c,{convexUrl:t.convexUrl,ownerId:t.ownerId});console.log("[DiscoveryOrchestrator] Created:"),console.log("  - 1 ProductProject"),console.log("  - 1 PRD"),console.log(`  - ${u.epicIds.length} Epics`),console.log(`  - ${u.ticketIds.length} Tickets`),await r.mutation(b.api.discovery.storeArtifacts,{sessionId:e,artifacts:{projectId:u.projectId,prdId:u.prdId,epicIds:u.epicIds,ticketIds:u.ticketIds}}),l.clientEmail&&t.resendApiKey?(console.log("[DiscoveryOrchestrator] Sending notification email..."),await I(l,c,u,t),await r.mutation(b.api.discovery.markNotificationSent,{sessionId:e})):console.log("[DiscoveryOrchestrator] Skipping email (no client email or Resend key)");let p=(i=c.requestedFeatures.filter(e=>"must"===e.priority).map(e=>e.name).join(", "),a=c.targetUsers.slice(0,3).map(e=>e.persona).join(", "),`## Generated Artifacts Summary

**Project:** ${c.projectName||"Unnamed Project"}
**Call Duration:** ${Math.floor(c.callDuration/60)} minutes
**Confidence:** ${Math.round(100*c.confidenceScore)}%

### Created
- 1 ProductProject
- 1 PRD
- ${u.epicIds.length} Epics
- ${u.ticketIds.length} Tickets

### Problem
${c.problemStatement}
**Severity:** ${c.problemSeverity}

### Target Users
${a}

### Must-Have Features
${i||"None explicitly identified"}

### Next Steps
${c.suggestedFollowUps.slice(0,3).map(e=>`- ${e}`).join("\n")}
`);return console.log("[DiscoveryOrchestrator] Processing complete!"),console.log(p),{success:!0,sessionId:e,insights:c,artifacts:u,qualityScore:d.score}}catch(n){let t=n instanceof Error?n.message:"Unknown error";return console.error("[DiscoveryOrchestrator] Processing failed:",t),await r.mutation(b.api.discovery.markError,{sessionId:e,error:t}),{success:!1,sessionId:e,error:t}}}async function I(e,t,r,n){var o;let s;if(!e.clientEmail)throw Error("No client email available");if(!n.resendApiKey)throw Error("Resend API key not configured");let i={clientName:e.clientName||"there",clientEmail:e.clientEmail,projectName:t.projectName||"Your Project",problemSummary:t.problemStatement.slice(0,200)+"...",usersSummary:t.targetUsers.map(e=>e.persona).join(", "),featuresSummary:t.requestedFeatures.filter(e=>"must"===e.priority).map(e=>e.name).join(", "),prdLink:`${n.baseUrl}/projects/${r.projectId}/prd/${r.prdId}`,callDuration:(s=Math.floor((e.duration||0)/60))<1?"brief":1===s?"1 minute":`${s} minute`},a=(o=i,`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Project Brief is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Hey ${o.clientName}! 👋
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Your project brief from our call is ready.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Thanks for taking the time to chat with me. I've put together a comprehensive brief based on our ${o.callDuration} conversation.
              </p>

              <!-- Summary Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">
                      ${o.projectName}
                    </h2>

                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <strong>The Problem:</strong> ${o.problemSummary}
                    </p>

                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <strong>Target Users:</strong> ${o.usersSummary}
                    </p>

                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <strong>Key Features:</strong> ${o.featuresSummary}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${o.prdLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
                      View Full Brief →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                The brief includes detailed user personas, prioritized features, and acceptance criteria. If anything looks off or you want to dig deeper into any area, just reply to this email.
              </p>

              <p style="margin: 24px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Talk soon,<br>
                <strong>James</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                This brief was generated from our discovery call using AI-assisted analysis.
                <br>
                8gent • Product Builder • San Francisco
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`),l=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${n.resendApiKey}`,"Content-Type":"application/json"},body:JSON.stringify({from:"James <james@openclaw.io>",to:e.clientEmail,subject:`Your Project Brief is Ready - ${i.projectName}`,html:a})});if(!l.ok){let e=await l.text();throw Error(`Failed to send email: ${e}`)}console.log(`[DiscoveryOrchestrator] Email sent to ${e.clientEmail}`)}async function j(e,t,r,n){let o=new b.ConvexHttpClient(n.convexUrl),s=await o.query(b.api.discovery.getSessionByCallerId,{callerId:e});if(!s)throw Error(`No active session found for caller ${e}`);return await o.mutation(b.api.discovery.updateTranscript,{sessionId:s._id,transcript:t,duration:r}),A(s._id,n)}let N=process.env.DISCOVERY_WEBHOOK_SECRET;async function U(e){try{let t=e.headers.get("Authorization");if(N&&(!t||t!==`Bearer ${N}`))return console.error("[DiscoveryWebhook] Invalid or missing authorization"),v.NextResponse.json({error:"Unauthorized"},{status:401});let r=await e.json();if(!r.callerId)return v.NextResponse.json({error:"Missing required field: callerId"},{status:400});if(!r.transcript||!Array.isArray(r.transcript))return v.NextResponse.json({error:"Missing or invalid field: transcript"},{status:400});if("number"!=typeof r.duration)return v.NextResponse.json({error:"Missing or invalid field: duration"},{status:400});if(console.log("[DiscoveryWebhook] Received call end webhook"),console.log(`  Caller: ${r.callerId}`),console.log(`  Duration: ${r.duration}s`),console.log(`  Transcript entries: ${r.transcript.length}`),r.transcript.length<4)return console.log("[DiscoveryWebhook] Transcript too short, skipping processing"),v.NextResponse.json({success:!1,reason:"Transcript too short for meaningful analysis"});let n=process.env.NEXT_PUBLIC_CONVEX_URL,o=process.env.OWNER_USER_ID||"system",s=process.env.NEXT_PUBLIC_APP_URL||"https://openclaw.io",i=process.env.RESEND_API_KEY;if(!n)throw Error("NEXT_PUBLIC_CONVEX_URL not configured");let a=await j(r.callerId,r.transcript,r.duration,{convexUrl:n,ownerId:o,baseUrl:s,resendApiKey:i});if(a.success)return console.log("[DiscoveryWebhook] Processing complete"),console.log(`  Quality score: ${a.qualityScore}/100`),console.log(`  Artifacts: ${a.artifacts?.ticketIds.length||0} tickets created`),v.NextResponse.json({success:!0,sessionId:a.sessionId,qualityScore:a.qualityScore,artifacts:{projectId:a.artifacts?.projectId,prdId:a.artifacts?.prdId,epicCount:a.artifacts?.epicIds.length,ticketCount:a.artifacts?.ticketIds.length}});return console.error("[DiscoveryWebhook] Processing failed:",a.error),v.NextResponse.json({success:!1,sessionId:a.sessionId,error:a.error})}catch(e){return console.error("[DiscoveryWebhook] Error:",e),v.NextResponse.json({error:e instanceof Error?e.message:"Internal server error"},{status:500})}}async function T(){return v.NextResponse.json({status:"ok",service:"discovery-webhook",version:"1.0.0"})}e.s(["GET",()=>T,"POST",()=>U],774709);var O=e.i(774709);let D=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/webhooks/discovery/route",pathname:"/api/webhooks/discovery",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/webhooks/discovery/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:F,workUnitAsyncStorage:q,serverHooks:M}=D;function _(){return(0,n.patchFetch)({workAsyncStorage:F,workUnitAsyncStorage:q})}async function H(e,t,n){D.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/webhooks/discovery/route";v=v.replace(/\/index$/,"")||"/";let b=await D.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:w,params:x,nextConfig:R,parsedUrl:k,isDraftMode:$,prerenderManifest:C,routerServerContext:S,isOnDemandRevalidate:E,revalidateOnlyGenerated:P,resolvedPathname:A,clientReferenceManifest:I,serverActionsManifest:j}=b,N=(0,a.normalizeAppPath)(v),U=!!(C.dynamicRoutes[N]||C.routes[A]),T=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,k,!1):t.end("This page could not be found"),null);if(U&&!$){let e=!!C.routes[A],t=C.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await T();throw new f.NoFallbackError}}let O=null;!U||D.isDev||$||(O="/index"===(O=A)?"/":O);let F=!0===D.isDev||!U,q=U&&!F;j&&I&&(0,i.setManifestsSingleton)({page:v,clientReferenceManifest:I,serverActionsManifest:j});let M=e.method||"GET",_=(0,s.getTracer)(),H=_.getActiveScopeSpan(),B={params:x,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,o)=>D.onRequestError(e,t,n,o,S)},sharedContext:{buildId:w}},L=new l.NodeNextRequest(e),z=new l.NodeNextResponse(t),W=c.NextRequestAdapter.fromNodeNextRequest(L,(0,c.signalFromNodeResponse)(t));try{let i=async e=>D.handle(W,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=_.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${M} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${v}`)}),a=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var s,l;let c=async({previousCacheEntry:r})=>{try{if(!a&&E&&P&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(o);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let c=B.renderOpts.collectedTags;if(!U)return await (0,p.sendResponse)(L,z,s,B.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(s.headers);c&&(t[m.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await D.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:E})},!1,S),t}},d=await D.handleResponse({req:e,nextConfig:R,cacheKey:O,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:P,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:a});if(!U)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});a||t.setHeader("x-nextjs-cache",E?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),$&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return a&&U||f.delete(m.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,g.getCacheControlHeader)(d.cacheControl)),await (0,p.sendResponse)(L,z,new Response(d.value.body,{headers:f,status:d.value.status||200})),null};H?await l(H):await _.withPropagatedContext(e.headers,()=>_.trace(d.BaseServerSpan.handleRequest,{spanName:`${M} ${v}`,kind:s.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},l))}catch(t){if(t instanceof f.NoFallbackError||await D.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:E})},!1,S),U)throw t;return await (0,p.sendResponse)(L,z,new Response(null,{status:500})),null}}e.s(["handler",()=>H,"patchFetch",()=>_,"routeModule",()=>D,"serverHooks",()=>M,"workAsyncStorage",()=>F,"workUnitAsyncStorage",()=>q],215781)}];

//# sourceMappingURL=5d253_next_dist_esm_build_templates_app-route_95c15f5a.js.map