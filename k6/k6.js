import { browser } from "k6/browser";
import { sleep } from "k6";

const loginUrl = "path/to/create-account"; // e.g. http://localhost:3001/create-account
const threadUrl = "patth/to/thread/to/test"; // e.g. http://localhost:3000/channels/:id/threads/:id";

export const options = {
  scenarios: {
    stress_test: {
      executor: "constant-arrival-rate",
      rate: 1, // Number of virtual users to simulate per second
      duration: "10m", // Duration of the test
      preAllocatedVUs: 300, // Number of VUs to pre-allocate before the test starts
      maxVUs: 300, // Maximum number of VUs to scale up to during the test
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};
const latencies = [];
export function handleSummary(data) {
  const sum = latencies.reduce((a, b) => a + b, 0);
  console.log(sum, latencies.length, sum / latencies.length);
  return {
    "summary.json": JSON.stringify({
      data,
    }),
  };
}

export default async function () {
  const page = await browser.newPage();
  const random = Math.floor(Math.random() * 100);

  try {
    // randomly choose whether to log in or not
    if (random < 50) {
      console.log("logging in.");

      await page.locator(loginUrl);
      await page.waitForTimeout(5000);

      const testerNumber = Math.floor(Math.random() * 10000000);

      // Enter login credentials
      const username = page.locator('input[placeholder="new username"]');
      await username.type(`bot-${testerNumber}`);
      username.dispatchEvent("input");

      const password = page.locator('input[placeholder="password"]');
      await password.type("password1");
      password.dispatchEvent("input");

      const password2 = page.locator('input[placeholder="confirm password"]');
      await password2.type("password1");
      password2.dispatchEvent("input");

      const email = page.locator('input[placeholder="Email (optional)"]');

      await email.type(`tester${testerNumber}@example.com`);
      email.dispatchEvent("input");

      const submitButton = page.locator('input[type="submit"]');

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        submitButton.click(),
      ]);
    } else {
      console.log("Not logging in.");
    }

    await page.goto(threadUrl);
    await page.waitForTimeout(10000);

    const start = new Date();

    const messageTextArea = page.locator("#messageTextArea");

    await messageTextArea.click();
    await messageTextArea.type("I am entering the chat. Hello. I am a bot.");
    await page.keyboard.down("Enter");

    const end = new Date();

    latencies.push(end - start);

    sleep(30);

    for (const message of messages) {
      await messageTextArea.type(message.toString());
      await page.keyboard.press("Enter");
      sleep(30);
    }
  } finally {
    await page.close();
  }
}

const messages = [
  `According to legend, King James I disposed of Sir Walter Raleigh, a political enemy, by rigging a prosecution against him.`,
  `At King James' instigation, Lord Coke, the king's Law Lord, prosecuted Raleigh for treason.`,
  `Coke based his case against Raleigh on a confession coerced from Raleigh's friend, Lord Cobham, whom Coke had incarcerated in the Tower of London.`,
  `Cobham, in his confession, accused Raleigh of conspiring to kill the king.`,
  `'At the trial, when Coke introduced Cobham's confession into evidence, Raleigh objected: But it is strange to see how you press me still with my Lord Cob ham, and yet will not produce him`,
  `[H]e is in the house hard by and may soon be brought hither; let him be produced, and if he will yet accuse me or avow this Confession of his, it shall convict me and ease you of further proof.`,
  `But instead of producing Cobham, Coke offered "further proof.`,
  `"To corroborate Cobham's hearsay accusation, Coke called a witness, a boat pilot named Dyer, who reported what a Portuguese gentleman had said to him.`,
  `According to Dyer, the Portuguese gentleman said: "[Y]our King [James] shall never be crowned, for Don Cobham and Don Raleigh will cut his throat before he come to be crowned.`,
  `"Raleigh objected again: "This is the saying of some wild Jesuit or beggarly Priest; but what proof is it against me?"Lord Coke responded: "It must per force arise out of some preceding intelligence, and shows that your treason had wings.`,
  `"The court allowed the evidence, and on this evidence-the hearsay of Cobham's confession and the hearsay of the Portuguese gentleman-Raleigh was convicted and eventually executed.`,
  `More than any other story, the story of Raleigh's case, handed down over generations, has driven Anglo-American lawyers to limit the use of hearsay and to ensure a right of confrontation.`,
  `The sense of injustice evoked by this story has framed our thoughts on how a trial can fail to produce social conviction-in the sense of certainty of belief-in the wake of a criminal conviction.`,
  `When a trial fails to produce social conviction, it fails in one of its essential roles: reestablishing social peace in the wake of a breach.`,
  `One of our most fundamental human experiences is learning as babies to trust our sense perceptions.`,
  `From the moment we first open our eyes, we learn to interpret and assimilate the information our senses gather from the environment around us.`,
  `The experi ence lives with us throughout our lives and has come to define the baseline of certainty in our culture.`,
  `We live, however, in a world in which most of the events that affect our lives occur beyond our sense perception.`,
  `Television, gossip, the Statistical Abstract of the United States, and the Bible are major sources of compensation for our limited vision.`,
  `So, too, is the jury trial.`,
  `The jury trial is one institution with which we try to compensate for our inability to perceive events that affect our lives and for our resulting lack of confidence in our ability to form accurate beliefs about, or responses to, those events.`,
  `In this theater of perceptions, we stage experiences to be perceived (testimonial evidence), and we cast others as surrogates for our own eyes (jurors).`,
  `We thereby recreate a sensory experience about the original event that allows us to feel as though we had actually witnessed that event ourselves.`,
  `Through the verification of sense perception, we form convictions both about what happened and about the appropriate societal response to what happened.`,
  `A trial, then, is like a television news program, a well-orchestrated performance that we watch to learn what has happened in parts of the world far from our own eyes.`,
  `The role of the judge is to ensure that the trial looks like Nightline, not like a television tabloid.`,
  `What is the outcome of a criminal trial? A verdict, a conviction.`,
  `These terms reflect a cultural yearning for social peace based on truth and certitude.`,
  `They project a conception of peace based on our capacity as a society objectively to identify certain forms of behavior as good in the face of diverse, and often conflicting, subjective notions of good behavior.`,
  `This basis for peace depends on three components.`,
  `First, we must be able to articulate a widely acceptable set of rules defining good behavior.`,
  `Second, we must have an enforcement mechanism that closely tracks the rules of behavior, so that individuals may not evade those rules by complying narrowly with the requirements of the enforcement mechanism.`,
  `Finally, we must believe that the individuals whom we coerce and subject to violence through our enforcement mechanism have actually behaved in ways that violate our rules of behavior.`,
  `Without this final component, enforcement will yield social fear rather than social peace.`,
  `This Essay focuses on this last component by discussing the trial as a social process by which we, as a collectivity, reach the level of certainty of the defendant's guilt necessary to warrant the infliction of social violence.`,
  `How do we know that the convicted criminal did what he or she was accused of doing? We don't "know.`,
  `"The jury's finding is about conviction-certainty of belief-not about verity.`,
  `The trial produces the psychological experience of conviction, not an epistemically valid truth-statement.`,
  `The trial is therefore structured to emulate our most widely shared cultural understanding about what leads to conviction.`,
  `In our culture, in which seeing is believing, our most fundamental experience of conviction arises from personal sense perception.`,
  `Thus, in order to produce conviction, the trial is structured to create a surrogate for sense perception.`,
  `The two most powerful images of the truth-seeking qualities of the American trial are testimonial evidence and the jury.`,
  `Testimonial evidence is by no means the only way to present information.`,
  `Other legal systems employ and trust a notion of trial by dossier.`,
  `Yet testimonial evidence is central in our system.`,
  `We bring witnesses to testify at trial from memory of events that may have taken place two or three years before, even though we have depositions or statements taken mere hours or days after the event.`,
  `We bring expert witnesses to testify at trial when there is no reason to believe that the information they convey orally will be any more accurate or comprehensive than what they would convey in a written report.`,
  `Indeed, the very opposite is likely.`,
  `Yet we put them on the stand and subject them to the same process of cross-examination as though they were testifying about an event.`,
  `The second defining image is that of the jury.`,
  `As with testimonial evidence, employing a lay jury for factfinding is by no means a universal practice.`,
  `We nevertheless maintain a very powerful affinity for a system of trial by a jury of our peers that will represent a cross section of the population, that will be us in that courtroom, to determine the value of testimonial evidence.`,
  `Testimonial evidence before a jury reproduces the experience of sense perception to allow society to reach a conviction about what happened.`,
  `Sensory experience can be parsed into three components: stimulus, mindset, and setting.`,
  `"A stimulus is received by our sensory capacities in a certain mindset and under certain circumstances, both of which affect our interpretation of the stimulus.`,
  `In any trial, all of society but the sensory witnesses "missed"the stimulus of the actual event that is the subject of the case.`,
  `To compensate for the lack of first-hand sensory knowledge, testimonial evidence reproduces the effect of stimuli, and the jury, through the fair cross section requirement, acts in a sensory capacity for the rest of us by receiving and processing those courtroom stimuli.`,
  `The jury at trial embodies a vision of ourselves in our least interpretive mindset and social setting-we are open and unbiased.`,
  `The setting, impartial trial by combat between two represented parties, is the most objective, evenhanded setting we generally imagine.`,
  `This arrangement facilitates the creation of social certainty of belief-social conviction-by means of the jury's decision-the criminal conviction.`,
  `The jury trial may fail, however, to serve as an effective surrogate for our sense perceptions.`,
  `Mistakes may occur at any point in the production of the surrogacy, with the result that we do not credit the jury's decision.`,
  `If, for example, we consider the jury selection process to have been skewed, we would feel that the mindset of our sensory surrogates was wrong and, therefore, that the result the jury reached was likely wrong.`,
  `If we consider the courtroom a hostile setting, or the jury affected by media prejudgment, the verdict will fail to produce the psychological effect of social peace.`,
  `Most important for purposes of our discussion here are mistakes at the level of the stimulus.`,
  `Evidence that is not a good surrogate stimulus, that does not produce in jurors the feeling of seeing the events with their own eyes, calls into question the adequacy of the trial as surrogate sense perception.`,
  `Consider the example of proof by mathematical probability.`,
  `When the victim was hit by a bus and the defendant owns nine out of the ten buses in town, the stimulus is not sensory, but intellectual.`,
  `Regardless of how sophisticated this proof may be, it suffers from the weaknesses of conviction in speculative thought relative to the broader cultural acceptance of sense perception as truth.`,
  `Compare that example with the Rodney King trial, in which the central stimulus was a video tape that provided most of society with the unique opportunity to be exposed to the same stimulus as the jury.`,
  `We did not need the jury as a surrogate, and we did not accept its acquittal precisely because we could see for ourselves and form our own conviction.`,
  `The judge's role in this process is to ensure that the stimulus, mindset, and setting are all sufficiently well presented so that they will produce social conviction.`,
  `Through instructions to the jury, admonitions to counsel, and rulings on objections, the judge ensures that the mindset and setting are presented as unbiased, open, and objective.`,
  `But the judge's most important role is to oversee the production and quality of the stimulus-the evidence.`,
  `The judge does this at two points in a trial.`,
  `The first point is upon production of the stimulus, when the judge determines admissibility, whether particular stimuli the parties want to create at trial will be allowed.`,
  `The second point is upon absorption of the stimulus, when the stimulus is allowed to enter into an evaluative mindset and to produce a conviction about the truth.`,
  `We generally call this determination sufficiency to reach the jury or a directed verdict.`,
  `Conceiving of the judge's role as regulating the quality of the stimulus emphasizes a holistic conception of judicial oversight of the evidence.`,
  `It is intended as a more flexible approach than the dominant "admissibility/sufficiency"distinction, which has often been deployed to justify limited judicial oversight.`,
  `Forceful judges commonly exercise broad, discretionary review at the sufficiency level but apply a more technical, mechanical rule-application approach at the admissibility level.`,
  `Less forceful judges import the mechanical approach to the sufficiency level as well, effectively abdicating their responsibility to ensure the quality of the evidence presented to the jury.`,
  `If a piece of evidence is not excludable under a given rule, then the evidence is admitted, no matter how flimsy and incredible, and the jury is left with the responsibility of assigning weights and determining whether the evidence is credible, whether it is persuasive enough to convict.`,
  `If, however, the judge's role is to produce a high-quality sensory surrogate, the judge must exercise effective assessment of both the foundational quality of each piece of evidence at the point of stimulus production and the overall quality of the totality of evidence at the point of stimulus transfer to the evaluative mind of the jury.`,
  `There is, however, an important difference between judges'assessment of overall sufficiency at the end of the trial and their assessment of foundational adequacy at the beginning.`,
  `At the end of trial, the judge, like the jury, must consider the evidence in its entirety and ask whether it is sufficient to allow reasonable people to reach a guilty verdict.`,
  `At the foundational level, the judge must ask a narrower question, similar to the one a judge asks in assessing the foundation of expert testimony or physical evidence: Is there a basis upon which to conclude that this particular portion of the evidence is competent? For purposes of the judge's role as master of the evidence, incompetent evidence is evidence whose introduction will mar the quality of the whole evidentiary stimulus and will put the social credibility of the jury's verdict at risk.`,
  `The judge's role at the foundational level, then, is to exclude evidence that the jury should not believe, not evidence that the jury will not believe.`,
  `What is it about hearsay that conflicts with the role of trial in producing social peace? Testimonial evidence is our surrogate stimulus-it is the event that we, through the jury, actually see.`,
  `We see the quiver, the small bead of sweat forming at the corner of the witness'eyebrow.`,
  `Why is he hesitating? What is she hiding? We are there, where the action is.`,
  `The sin of hearsay is that it robs us of the believability of the surrogate stimulus.`,
  `The witness who is before the jury did not actually see anything, but is merely relaying the account of someone who did see something.`,
  `Hearsay leaves us twice removed from the original breach of peace.`,
  `Once, we are removed from the defendant-victim interaction by relying on the jury-witness interaction.`,
  `Then again, we are removed from the witness-event interaction by relying on the reporter-declarant interaction.`,
  `This second degree of separation threatens to render the performance of the trial inadequate to produce the social conviction necessary to reestablish social peace.`,
  `The traditional hearsay exceptions provide our first line of defense against the separation between our senses and the event about which we yearn to reach a conviction.`,
  `They are, like the old costumes of a Shakespeare company, familiar and trusted devices to help us suspend our disbelief and view as authentic what we know to be mere theatrical performance.`,
  `Like those costumes, though, many exceptions have worn too thin to remain convincing, to keep the theater-goers believing.`,
  `Consider, for instance, the dying declarations exception, which arises from the cultural experience of "facing one's Maker"as a moment of truth.`,
  `But in a culture that only grows more cynical about the authenticity of religious experience, the exception loses its rhetorical force.`,
  `Dying declarations no longer evoke the image of a person making a solemn statement on the death bed, before a confessor, surrounded by family members.`,
  `Instead, we more commonly envision a drugged, whispering patient in an impersonal hospital, alone except for a detective holding a little black book and straining to hear a name gasped against the flow of pure oxygen.`,
  `The contemporary image lacks the comforting effect of the traditional one.`,
  `As knowledge of human psychology becomes more sophisticated and widely disseminated, that discomfort extends to more of the hearsay exceptions.`,
  `Do we still believe that people excited by an upsetting event are more likely to tell the truth than to exonerate themselves, to distance themselves from blame?18 Do we still believe that a plaintiff is more likely to tell the truth to the physician hired to testify as an expert at the plaintiff's trial than to any other person whose testimony does not fit another hearsay exception? Why then, if we can no longer cling to our traditional hearsay exceptions, should we not adopt a flat ban on hearsay? Although our psychological sophistication with respect to the old stories of the hearsay exceptions diminishes the value of hearsay, our changing conception of truth tends nevertheless toward allowing some hearsay into evidence.`,
  `Today we accept much more broadly the role of narrative truth, as opposed to absolute, objective, divine, or scientific truth, as a constitutive element of our convictions about the world.`,
  `We are thus caught in a tension between our reluctance to accept a single, objective truth, unaffected by perspective, and our endeavor at trial to produce conviction about the truth.`,
  `The significance we attribute to the role of narratives in the production of social truth means that we cannot afford a strict no-hearsay rule.`,
  `Hearsay testimony often presents powerful narratives that can shape our understanding of the events.`,
  `The common-law hearsay rules are rough descriptors of hearsay stories with this power.`,
  `For a trial to function as a believable reenactment of an event, it must include all the compelling stories that can be told about the event.`,
  `We must get every view from every angle so that we can unite them in our own minds and determine what "really"happened.`,
  `A strict ban on hearsay would allow too few views.`,
  `Such a rule would run the risk of allowing a powerful counterstory to acquire a life of its own outside the courtroom, upsetting the frail conviction produced by a completed trial.`,
  `It is the rhetorical force of a dying declaration that allows it into the courtroom, not its inherent tendency to be true.`,
  `Hearsay evidence, therefore, poses a dilemma for a jury trial whose purpose is to produce social conviction.`,
  `It may be too powerful to exclude entirely from the courtroom, yet too weak to sustain a conviction by itself.`,
  `The social necessity of allowing the introduction of hearsay in trials and the injunction of the Confrontation Clause that defendants be able to confront the evidence against them have posed an insoluble paradox for the Supreme Court.`,
  `Read literally, the Confrontation Clause appears to give criminal defendants the unequivocal right to confront and cross-examine their accusers.`,
  `Reading the Clause in this fashion would constitutionalize a clean ban on hearsay, barring without exception the admission of hearsay evidence against criminal defendants.`,
  `A flat no-hearsay rule would exclude evidence that sensible judges want factfinders to hear.`,
  `Every hearsay exception purports to describe such a situation.`,
  `Interpreting the Confrontation Clause to impose a flat ban on hearsay at a constitutional level would wipe out the evidentiary hearsay exceptions that have emerged through the common law development of evidence rules.`,
  `The Supreme Court has never been willing to take such a stringent view of the confrontation requirement.`,
  `Instead, the Supreme Court has recognized that well-established exceptions to the hearsay rule should also be treated as exceptions to the constitutional confrontation requirement.`,
  `The Court's bipolar construction of the problem-hearsay versus confrontation-is a conceptual trap.`,
  `Once the Court recognizes traditional hearsay exceptions as exceptions to the confrontation requirement, there is no clear stopping point.`,
  `Must the Court go all the way, accepting any exception to the hearsay rule as also an exception to the constitutional right of confrontation? The hearsay rule and its exceptions have been generated through common law development and legislative enactment, evolving into a mind-numbing hodgepodge, a "rule"with more than twenty-five exclusions and exceptions (including a catchall exception) and no clear underlying standard.`,
  `As such, the doctrine cannot express a coherent constitutional principle.`,
  `Why should this process of development be accorded absolute constitutional respect in the context of hearsay but in no other context? The trap of equating the right of confrontation with hearsay law gives us a constitutional rule that epitomizes legal technicality, subordinates the Constitution to common-law rules of evidence, and lacks any clear bounds or coherent rationalization.`,
  `The love-hate relationship between the law of hearsay and the Confrontation Clause began relatively late in our constitutional history.`,
  `For the first century of criminal procedure, before the intermediate federal courts of appeal were created, federal criminal appeals were available only in the Supreme Court, almost exclusively to challenge the jurisdiction of the federal trial court.`,
  `The trial court's holdings were nowhere reviewed for error, constitutional or procedural.`,
  `After the federal courts of appeals were created and empowered to hear more extensive criminal appeals than the Supreme Court had previously heard, a first attempt to invoke the Confrontation Clause in order to exclude hearsay evidence emerged, but was quickly stifled.`,
  `In Mattox v. United States,23 two defendants who had been convicted in a jury trial appealed to the new intermediate court.`,
  `Their convictions were reversed and a new trial was ordered.`,
  `By the time of this second trial, the prosecution's two key witnesses had died (we know not how).`,
  `The prosecutor offered in evidence not witnesses who could be cross-examined, but rather transcribed copies of the reporter's stenographic notes from the testimony in the previous trial.`,
  `The defendants claimed that the introduction of these notes violated their rights under the Confrontation Clause of the Sixth Amendment.`,
  `In response, the Supreme Court in Mattox did two things.`,
  `First, it put the problem of confrontation and hearsay into a state of deep hibernation for seventy years.`,
  `Second, it laid the foundations for the conceptual trap that still haunts the problem.`,
  `The Court rejected the defendants'claim that the introduction of hearsay created a Confrontation Clause problem.`,
  `The opinion reasoned that the law at the time of the adoption of the Constitution recognized dying declarations as an exception to the need for Confrontation, and that the right of confrontation was equivalent to the right to cross-examine.`,
  `The Court then reasoned that the sworn, recorded, previously cross-examined testimony of the two deceased prosecution witnesses was more reliable than a dying declaration, and therefore not constitutionally objectionable.`,
  `The Court thereby established reliability as the lodestar of confrontation, and selected one of the most questionably reliable hearsay exceptions-dying declaration-as the rod by which to measure that reliability.`,
  `Mattox so effectively neutralized the Confrontation Clause that no further challenges were brought until 1965, when the Warren Court's defense of the rights of criminal defendants and the advent of incorporation increased both the pool of potentially reviewable cases and the likelihood that the old doctrine might be reviewed.`,
  `In Pointer v. Texas,26 a witness for the prosecution, who had testified against a defendant at a preliminary hearing, could not be found to testify against the defendant at the time of trial.`,
  `The prosecutor introduced the transcript of the witness'testimony from that preliminary hearing, which the trial court allowed to be introduced, and on the basis of this hearsay testimony the defendant was convicted.`,
  `Justice Hugo Black, writing for the Court, held that the Confrontation Clause applied in state court proceedings and required that defendants be able to confront and cross-examine their accusers.`,
  `Because the defendant had been unrepresented at the preliminary hearing, introducing the evidence had denied the defendant effective opportunity to cross-examine and to vindicate his right to confrontation.`,
  `With this ruling the Supreme Court appeared suddenly to give teeth to the Confrontation Clause.`,
  `It created, however, a conceptual problem: If the opportunity for cross-examination is required at least at some point along the way, what about evidence admitted under exceptions to the hearsay rule? Which hearsay exceptions will pass muster and which will not? Would the Court have to parse out and examine the reliability of the hearsay exceptions and justify each of them constitutionally? Justice John Harlan was the first to offer an interpretation of the Confrontation Clause that sought to free the Clause from its interpretation as an edict for cross-examination.`,
  `Concurring in California v. Green,28 Harlan suggested that the Confrontation Clause required only that accusing witnesses be produced by the prosecution if they were available.`,
  `If the witness is unavailable through no fault of the prosecution, then Harlan would find no confrontation problem in using the unavailable witness'hearsay accusation against the defendant.`,
  `But logical consistency, no less than justice, was not so easily found.`,
  `Harlan's effort to rectify the logic of the legal landscape failed to take account of the irrelevance of availability to many of the hearsay exceptions.`,
  `Business records, for example, are admissible without having to bring to court the actual author or authors of the record, even though available.`,
  `Harlan's approach, if adopted, would have wiped out such exceptions, forcing the prosecution to produce all available witnesses, even when their appearance was irrelevant to the justice or logic of the proceedings.`,
  `None of the justices, Harlan included, had any such intention.`,
  `Indeed, one year later, in Dutton v. Evans,31 Harlan recognized his error and recanted his proposal from Green, but no alternative standard emerged.`,
  `The plurality opinion in Dutton could do no more than point out that the hearsay in question was not crucial to the conviction, and its introduction was therefore not fatal.`,
  `Hearsay and confrontation remained in a hopeless tangle.`,
  `A decade later, in Ohio v. Roberts,33 Justice Harry Blackmun seemed to resuscitate the availability requirement.`,
  `He stated: "[Iun conformance with the Framers'preference for face-to-face accusation. [in the usual case. the prosecution must either produce, or demonstrate the unavailability of, the declarant.`,
  `"I Even if a witness is shown to be unavailable, however, "his statement is admissible only if it bears adequate 'indicia of reliability.`,
  `'Reliability can be inferred without more in a case where the evidence falls within a firmly rooted hearsay exception.`,
  `In other cases, the evidence must be excluded, at least absent a showing of particularized guarantees of trustworthiness.`,
  `"35 The conceptual problem that haunted Justice Harlan's requirement of availability came back to haunt Justice Blackmun.`,
  `Justice Blackmun's rule was saved by being refocused on the second hurdle that he had originally included: the requirement of reliability.`,
  `In the decade that followed Roberts, the Court came to differentiate strictly between hearsay that falls within the traditional hearsay rules and hearsay that does not.`,
  `Evidence that fell within the traditional rules was presumed reliable, and the Confrontation Clause was considered to require real inquiry only in those cases where no traditional exception could be found, and the evidence was introduced under the catchall provision of Federal Rule of Evidence 803(24) or its state equivalents.`,
  `Thus, the Supreme Court has returned almost full circle to Mattox.`,
  `Reliability is once more the lodestar of confrontation, and the good old common-law rules of hearsay are substituted for substantive evaluation of reliability.`,
  `Almost.`,
  `The contemporary law of confrontation still leaves one corner undetermined, one area that allows for substantive elaboration of what, after all, the Confrontation Clause requires with respect to the introduction of hearsay.`,
  `As one begins to formulate an alternative to the trapped tradition of confrontation and hearsay, one ought to keep in mind that analysis of constitutional rights need not focus solely on the stark conflict between the interests of the criminal defendant and those of the justice system.`,
  `One could, of course, portray the defendant as wanting to exclude as much evidence as possible, and the state as wanting to include as much evidence as possible.`,
  `These interests plainly conflict, and may better describe the empirical reality than a more principled view of the interests involved.`,
  `But to formulate a constitutional framework for the criminal trial, one might better focus on where the interests of the accused and of society coincide, rather than on where they diverge.`,
  `The principled interest of the accused could be conceived as the interest in securing full and fair opportunity to test the evidence.`,
  `This interest in testing, quite the opposite from conflicting with the interests of society, firmly coincides with the core values of trialthe production of verity, of conviction, of social peace.`,
  `Society will gain little from a criminal conviction that is so flawed as to fail to create social conviction.`,
  `Within this conceptual framework, a full vindication of the defendant's right to test the evidence will both protect the rights of the accused and best fulfill the important social roles of trial.`,
  `We began this Essay by evoking the age-old indignation that Sir Walter Raleigh's conviction and execution for treason infused in the Anglo-American legal tradition.`,
  `The revulsion at the injustice of Raleigh's conviction found its way into both sides of the paradox of confrontation and hearsay.`,
  `Tracing Raleigh's complaints therefore affords a good framework for understanding an alternative to the current condition of the law of confrontation and hearsay, Raleigh's story focuses on three complaints.`,
  `First, there is the matter of trial by reported, as opposed to direct testimonial, evidence.`,
  `Lord Cobham, complained Raleigh, was "in the house hard by"and could be produced.`,
  `This first complaint is the root of the general requirements, both of the hearsay rule and of the Confrontation Clause, that a witness generally be produced and give oral testimony at trial.`,
  `Failing to produce Cobham left Lord Coke with the need to provide "further proof.`,
  `"Implicit in Raleigh's demand of further proof is the notion that there is a tradeoff between producing testimonial evidence and producing corroborating evidence to supplement the hearsay of Cobham's accusation.`,
  `It is the capacity of corroborating evidence to cure the rhetorical deficit of hearsay that is important.`,
  `Corroboration reproduces the effect of testing, as the defendant recovers the opportunity to test the evidence-this time not the original testimonial evidence but the corroborating evidence instead.`,
  `But Lord Coke's corroborating evidence itself was yet more hearsay, offered by Dyer, the boat pilot, in the name of a Portuguese gentleman.`,
  `Interesting from our perspective is that Raleigh framed his objection to this evidence as a foundational challenge to the competence of the declarant, rather than as a challenge to the out-of-court status of the statement: "[T]his is the saying of some wild Jesuit or beggarly priest.`,
  `"Regardless of our contemporary opinion of Raleigh's rhetoric, the fundamental challenge he raised is important and separate from the problem of corroboration that he raised with respect to the report of Cobham's accusation.`,
  `It is the challenge that, in order to be admissible, a hearsay statement must have sufficient independent foundation so as not to mar the body of the evidence.`,
  `Raleigh in effect claimed that the declaration of an incompetent declarant, no matter how competently and credibly reported by the reporter, lacks adequate foundation for admission into evidence.`,
  `The story of Raleigh leaves us with a general framework with which we might seek a way out of the trapped tradition of confrontation and hearsay.`,
  `It suggests that, in order to fulfill both the interests of the defendant in testing the evidence and the interests of society in attaining social peace through conviction, hearsay evidence may be admitted subject to two constraints.`,
  `First, each piece of hearsay must pass a judicial test of foundational soundness, independent of any other corroborating evidence that might be admitted into the corpus of the evidence at trial.`,
  `And, second, a conviction must not be based on uncorroborated hearsay.`,
  `To fulfill the values of confrontation meaningfully, neither corroboration nor foundational testing ought to be understood in mechanical terms.`,
  `Rather, our framework calls for a substantive judgment on the part of the judge both as to foundational adequacy of the hearsay and as to the sufficiency of the corroboration to remedy the credibility gap produced by the introduction of hearsay.`,
  `Theoretical and aesthetic coherence aside, is there a doctrinal toehold to support the conceptual framework we suggest here? Where does one begin to look for a way out of a tradition that, by definition, is trapped? We might begin to look in that corner of hearsay law that is not sufficiently entrenched to have barred judicial innovation-the area of hearsay evidence that does not fall within the traditional exceptions.`,
  `Despite their reluctance to revisit the first principles of hearsay and confrontation in the context of traditional hearsay exceptions, courts have been more willing to engage the questions posed by the interaction between the Confrontation Clause and hearsay when the evidence is introduced under an exception that falls outside the traditional framework.`,
  `It is in this segment of the law of hearsay and confrontation that a solution to the paradox is beginning to take form.`,
  `In Idaho v. Wright the Supreme Court may have begun to point a way out of the trap of hearsay and confrontation, although to define a solution one must fuse the positions of the majority and the dissent in that case.`,
  `The solution is based on two pillars.`,
  `First, the judge must take a nontechnical, substantive look at the independent competence and credibility of every component of evidence at the foundational level before admitting it into the body of the evidence as a whole.`,
  `Second, hearsay evidence must be corroborated to provide an adequate basis for a criminal conviction.`,
  `A. Judicial Foundational Testing Justice Sandra Day O'Connor, writing for the majority in Wright,38 was confronted with the out-of-court declaration of a child who allegedly had been sexually abused by her father.`,
  `The declaration was made to a physician, and there was genuine concern that the physician might have elicited the testimony from the child by asking suggestive questions.`,
  `The physician's testimony of the girl's statement was nevertheless introduced into evidence under a catchall exception to the hearsay rule equivalent to Federal Rule of Evidence 803(24).`,
  `One of the arguments for allowing the testimony into evidence was that there was, in the body of evidence taken as a whole, corroboration for the declaration as reported by the physician-the girl had physical signs of abuse.`,
  `In response, Justice O'Connor pointed out that "[t]o be admissible under the Confrontation Clause, hearsay evidence used to convict a defendant must possess indicia of reliability by virtue of its inherent trustworthiness, not by reference to other evidence at trial.`,
  `"Thus, although from the perspective of the evidence taken as a whole there was corroboration for the substance of the hearsay, the suggestive manner in which the physician had questioned the child robbed the hearsay of the indicia of reliability at a foundational level, so that it should not have been introduced into the corpus of the evidence in the first place.`,
  `It is this insight that forms the basis for the first pillar of the limitation that the Confrontation Clause places on the introduction of hearsay.`,
  `The specific component of evidence must be examined for its internal competence and credibility.`,
  `It is unconstitutional to admit a piece of evidence that is incompetent and incredible by its own rights simply because, taken together with the rest of the evidence, it would allow a reasonable jury to convict the defendant.`,
  `The focus on foundational adequacy as an independent requirement of the Confrontation Clause aligns the hearsay rules with broader principles of evidence.`,
  `All testimonial evidence includes both foundational and substantive components.`,
  `Foundational questions and substantive assertions can be intertwined in the tes mony of an eyewitness.`,
  `"I saw Sam pull out the gun and shoot Bill"includes the foundational assertion "I was there when it happened"and the substantive assertion "Sam shot Bill.`,
  `"Some testiconcerns over foundational sufficiency should consider Justice O'Connor's response to their position.`,
  `She noted that the corroborating evidence supported the hearsay allegation of abuse but not that of the identity of the abuser, creating a substantial risk of false accusation of the abuser. See id. at 824.`,
  `Testimonial evidence, like expert testimony, generally has a more distinct separation between foundation and substance.`,
  `The foundation must be laid first, and only then can the evidence be introduced.`,
  `Laying the foundation is a separate and distinct process from the assessment of the ultimate weight assigned in the overall balance of evidence.`,
  `Determining foundational adequacy is entrusted to the judge, who must weigh whether there is sufficient evidence to support a foundation for the particular expert testimony.`,
  `The judge's assessment is made independently from the rest of the evidence.`,
  `Only after the foundation is laid can the jury hear the testimony and perform its own weighing.`,
  `The jury assesses the sufficiency of the evidence as a whole to warrant an outcome, but it is the judge-and only the judge-who has the opportunity to examine each component of the evidence and to excise those components that would jeopardize the credibility of the verdict or the conviction as a source of social peace.`,
  `The Supreme Court recently visited the question of the relative roles of judge and jury in the production of a veritable verdict in the context of expert testimony.`,
  `In Daubert v. Merrell Dow Pharmaceuticals,42 the Court developed an approach that we suggest be used as a framework within which to implement Justice O'Connor's holding in Wright.`,
  `In Daubert, the Court reviewed a United States Court of Appeals for the Ninth Circuit decision that had excluded evidence based on the mechanical application of a rule making scientific evidence admissible only if it is "generally accepted"in the relevant scientific community.`,
  `The Court held that the trial judge must take a global approach to the foundational question of the reliability of the scientific method and must determine, as a matter of fact, taking into consideration all relevant evidence, whether the method is reliable enough to be admitted into evidence.`,
  `The Court specifically rejected the more mechanical rule application that judges tend to perform when they deal with questions of admissibility.`,
  `It emphasized the independent role of the trial judge in determining the foundation and rejected the abdication by judges of their duty to exercise judgment at the foundational level, in favor of the jury's judgment of the totality of the evidence.`,
  `We suggest that the trial judge has a similar responsibility in assessing the foundation of hearsay evidence.`,
  `When hearsay is sought to be introduced into evidence, the trial judge must assess its foundational adequacy to enter into evidence given the heavy burden it carries to replace the central image of the trial-testimonial evidence and confrontation through cross-examination in front of our surrogate eyes, the jury.`,
  `To determine foundational adequacy, the judge must assess the competence of the foundationfacts.`,
  `For the purpose of determining the adequacy of foundationfacts the judge is the factfinder.`,
  `Thus, for example, under present law, the judge (not the jury) determines whether a business record was made and kept in ordinary course or whether an utterance was excited for purposes of admissibility.`,
  `The same should be true for purposes of assessing foundational adequacy, where the judge is charged with establishing the "particularized guarantees of trustworthiness"of the offered hearsay "from the totality of the circumstances.`,
  `"49 On these foundational matters the judge is the outright factfinder, and not merely an appraiser of whether a reasonable juror could find that foundational requirements are met.`,
  `In this factfinding role, the judge must assess the competence and credibility of the foundation-fact witnesses50 and will be able to evaluate each component of the evidence in a factfinding process.`,
  `The defendant will be able to test the foundational facts of the competence and credibility of the declarant, the reporter, and the statement itself and will be able to introduce evidence that tends to contradict the foundational adequacy of the hearsay.`,
  `If, for example, the defendant can show that the declarant was seen at the time of the crime 100 miles from the place where the declarant allegedly saw the crime, this would be an appropriate foundational challenge to the introduction of the hearsay, even though it does not go to the credibility of the reporter.`,
  `This new opportunity to test the evidence will much better address the right of confrontation than the present situation in which unreliable, uncorroborated pieces of information are introduced merely because they fit mechanical findings of law.`,
  `B. Testing Hearsay Through Corroboration Part of the rhetorical effect of confrontation is the face-to-face match between accuser and accused.`,
  `The reenactment of the breach of the peace is at its highest drama when the victim, on the stand, points a finger across the room and loudly says, "He is the man!"But, of course, trials are not about this level of drama; the ballistics expert points a finger at no one and yet is on the stand.`,
  `Face-to-face confrontation is not always possible or necessary.`,
  `Indeed, when children are involved in a child-abuse case, we may intentionally avoid face-to-face confrontation.`,
  `Focusing on faceto-face confrontation elucidates, however, what is unique about testimonial evidence in front of a jury.`,
  `Through the presentation of testimonial evidence, the jury is made present at an event that we, the social audience, did not witness.`,
  `The jury is capable of making an assessment of truth, of reaching a conviction, based on sense perception-seeing and hearing the faces, voices, and movements of the witnesses and the defendant.`,
  `The confrontation of witness and cross-examiner provides a test of truth in the presence of the jury.`,
  `Confrontation, in the sense of cross-examination, has the quality of trial by fire.`,
  `By subjecting the stories competing for belief at trial to the grueling process of cross-examination, we test them.`,
  `A story that passes this test becomes capable of producing conviction.`,
  `A hearsay accusation, even one that has adequate foundation, is nevertheless an untested hypothesis of guilt.`,
  `When the rhetorical setting of cross-examination is missing, we need a similar test, another means of putting the evidence to the proof.`,
  `We propose that this test be corroboration.`,
  `Justice Anthony Kennedy, dissenting in Wright, clarified the centrality of corroboration for the credibility of hearsay evidence.`,
  `Kennedy evoked "the considered wisdom of virtually the entire legal community that corroborating evidence is relevant to reliability and trustworthiness.`,
  `""2 He argued that corroboration has always been part of assessing the reliability of hearsay,53 that corroboration is an important component of credibility,54 and that when there is physical evidence that comports with the substance of the declaration such evidence should be an important component in the judge's assessment of the admissibility of the hearsay.`,
  `55 Although Justice O'Connor, writing for the majority, rejected the centrality of corroboration, her opinion should be understood in context.`,
  `In Wright, O'Connor focused on the foundational adequacy of hearsay introduced under a nontraditional hearsay exception, and her dismissal of the importance of corroborating evidence in the limited context of foundational adequacy is not a rejection of the need for corroborating evidence generally.`,
  `Justice O'Connor's opinion need not, therefore, be read to reject the importance of corroboration to establish the credibility of hearsay.`,
  `Instead, her opinion should be read to apply solely to the first, foundational level alone.`,
  `In operative terms, her requirement of foundational adequacy independent of corroboration ensures that foundational adequacy will not be achieved by bootstrapping one piece of incompetent evidence to another in a "looking at the evidence as a whole"analysis at the end of trial.`,
  `Instead, each piece of hearsay must be independently competent and supported by corroborating evidence.`,
  `C. Expanding the Analysis To Cover Traditional Hearsay Exceptions We began this Part by noting that we were attempting to salvage an approach that was not caught in the trap of confrontation and hearsay by exploring the Supreme Court's treatment of the relationship between the Confrontation Clause and the nontraditional hearsay rules.`,
  `Implicit in that project is the recognition that, even in such cases, the Court explicitly limits its analysis to nontraditional hearsay evidence that is introduced under the catchall exception, whereas hearsay evidence that does fall under the traditional exceptions is presumed to be competent and admissible under the Confrontation Clause.`,
  `56 The Court's analysis in Wright, however, coupled with the analysis we have offered here, suggests that courts ought no longer to ignore the Confrontation Clause implications of hearsay, regardless of whether it falls under a well-established exception.`,
  `The need to expand the Confrontation Clause's limitations on hearsay to encompass all hearsay evidence can be implemented in two ways.`,
  `A minimalist implementation relies on the conception that the traditional hearsay exceptions go only to foundational adequacy and not to the overall sufficiency to convict.`,
  `Justice O'Connor in Wright specifically "exempts"the traditional hearsay exceptions from her opinion, but she does so only insofar as she is concerned with the existence of the indicia of reliability necessary for foundational adequacy under the Confrontation Clause.`,
  `Even if one accepts the presumptive foundational adequacy of hearsay that falls within a traditional exception, that foundational adequacy does not fulfill- the requirement of corroboration.`,
  `In this minimalist expansion, the Confrontation Clause would be read to require a two-tier test for hearsay not falling within a traditional exception.`,
  `Such hearsay would be tested both by foundational testing and by a requirement of corroboration.`,
  `Hearsay that does fall within a traditional exception would be presumed to have sound foundation, and would be tested only by a requirement of corroboration.`,
  `A more extensive expansion of Wright relies on the broader conception of the trial process and the role of testimonial evidence in the production of social peace through trial.`,
  `Under this conception, all forms of hearsay suffer from a rhetorical deficit-perhaps one might even call it a legitimacy deficit-that threatens the power of trials to produce social conviction.`,
  `The requirements of the Confrontation Clause are intended to remedy this deficit and to attain the social peace that is at least one central object of criminal trial by vindicating the interest of defendants in testing the evidence against them.`,
  `This expansion would require that all hearsay evidence be tested for both foundational adequacy and corroboration.`,
  `The traditional exceptions, although instructive as to the foundational adequacy of the hearsay, would not be decisive.`,
  `The criminal jury trial is the process by which society regains peace after its breach, by which we produce an understanding of the world, by which we reach a conviction about what happened and how we should respond to it.`,
  `In order to produce that certainty of belief, the trial process emulates our sense perception, the mode of knowledge on which we have come to rely more than any other.`,
  `In order to reproduce sense perception, the trial process includes the most fundamental components of a sensory experience.`,
  `The jury acts as our senses, and we compose it to be as much like "us"as we can.`,
  `We try to create both a jury that represents us when we are in an unbiased and openminded mindset, and an impartial setting for our attempt to understand the world around us.`,
  `The stimulus that triggers perception, that composes "the world around us,"is replicated by testimonial evidence.`,
  `Our conviction in the outcome of the trial, the standard by which we measure the success of the trial as a producer of social peace, is dependent upon the believability of the mindset, the setting, and the stimulus and, thus, the degree to which the trial can serve as an adequate surrogate for actually witnessing the event at issue.`,
  `It is the role of the judge to stage, direct, edit, and produce this theater of surrogate sense perception.`,
  `In so doing, the trial judge is the keeper of social peace.`,
  `The central means by which the trial emulates the stimulus of the actual event is testimonial evidence, tested through confrontation by cross-examination.`,
  `But not all evidence can be presented orally, in court.`,
  `Some evidence is reported from sources that do not or cannot present themselves before the factfinder.`,
  `If these sources provide powerful narratives about what happened on the scene of the crime, excluding these stories might threaten the credibility of the verdict.`,
  `These narratives must then be allowed to enter the courtroom.`,
  `But they must be allowed in with care, for they cannot be subjected to cross-examination and are too removed from the jury to allow us to rely on the jury's conviction of the truth of their stories without more.`,
  `In the absence of crossexamination, our confrontation is incomplete, our stimulus deficient in believability.`,
  `In order to remedy this deficiency, the trial judge must adopt a more active role in controlling the introduction of hearsay.`,
  `By requiring corroboration and by independently assessing the foundational competence of the evidence, the judge allows the defendant to test the hearsay evidence and ensures that only credible hearsay will be allowed to attenuate the defendant's right of confrontation in cases in which there is critical evidence that cannot be tested by cross-examination on the witness stand.`,
  `Instead of confronting the witness with the test of cross-examination, we confront the evidence with the tests of foundational adequacy and require that even well-founded hearsay evidence be corroborated before we allow it to form the basis of a conviction.`,
  `We reproduce the testing that is basic to our notions of reliability and credibility, testing that we need in order to believe this surrogate stimulus.`,
  `The trouble with hearsay is that it denies the defendant the opportunity to test the evidence and denies society the conviction forged by that testing.`,
  `To remedy this gap of testing and conviction, we propose an interpretation of the Confrontation Clause that will limit the use of hearsay evidence to situations in which (1) the judge has made an independent foundational finding that the hearsay is competent and (2) the hearsay is independently corroborated.`,
  `At the conceptual level, the interpretation we suggest allows the defendant to test the corroborating evidence, and affords society a strengthened conviction to compensate for the absence of testimonial evidence subjected to cross-examination.`,
  `At the doctrinal level, our position requires two modifications to current practice.`,
  `First, we propose that judges take an active, factfinding role at the stage of determining foundational adequacy, to ensure that only hearsay that is independently competent enter the body of the evidence.`,
  `Second, we propose that no conviction be based solely on hearsay evidence and that some corroborating evidence be required before a defendant may be convicted.`,
  `If we are to give the Confrontation Clause a meaningful role in regulating our trial process, we must understand the concept of testing that lies at its core.`,
  `Viewing it in this light, we should reject the current practice of allowing arcane rules of evidence that are no longer believable to undermine the credibility of trial as a source of truth and conviction.`,
  `The Confrontation Clause brings to the analysis of hearsay a commitment to the defendant's right to test the evidence.`,
  `Although rooted in the tradition of individual defendants'rights, testing serves more than the interests of the defendant.`,
  `Testing creates the sense of truth and conviction through which we begin the reestablishment of social peace that is the object of a criminal trial.`,
];
