# Image Prompt Optimizer Idea Brief

Last updated: 2026-04-23

## Source

- Original note: `/Users/lianglihang/Downloads/kepano-obsidian/文生图提示词优化器.md`
- Current project workspace: `/Users/lianglihang/Documents/programs/image-prompt-optimizer`

## Problem

Many creators can describe the image they want in natural language, but their prompts often omit concrete visual constraints. The result is a generated image that drifts from intent: missing scene details, wrong object orientation, unwanted visual emphasis, unclear device/screen direction, inconsistent style, or accidental sensitive-looking output.

The original example is a boy gaming in an esports room. The desired scene includes a specific room context and phone usage, but a vague prompt can produce an image where the model invents or misplaces details such as the room, the phone screen orientation, or unintended facial/visual cues.

## Target Users

Primary users for the first validation cycle:

- Overseas creators using image generation tools for thumbnails, social posts, ads, game assets, and concept visuals.
- Users in Stripe-supported markets where a lightweight SaaS payment flow can be tested without building a China-specific payment stack.
- Users who know what they want visually but do not know how to express it as a model-ready prompt.

Not first-cycle users:

- Mainland China creators who require local payment methods or China-specific hosting.
- Enterprise design teams needing approval workflow, brand governance, or asset management.
- Advanced prompt engineers who want full parameter control, prompt libraries, batch pipelines, or LoRA/model operations.

## MVP Positioning

The MVP is a prompt checker and optimizer, not a universal prompt generator.

It should take a rough image idea and produce a more controllable prompt by:

- Asking clarifying questions only when the missing detail materially affects the image.
- Rewriting the prompt with explicit subject, setting, composition, object orientation, lighting, style, and constraints.
- Suggesting negative prompts or avoidance notes for likely failure modes.
- Explaining model-specific considerations for common tools such as Midjourney, Flux, Stable Diffusion, DALL-E, or similar systems.
- Making the final prompt easy to copy and test.

## Explicit Non-Goals

- Do not help users bypass model safety systems.
- Do not optimize prompts for illegal, sexual, exploitative, hateful, or otherwise disallowed content.
- Do not promise that prompt optimization can guarantee a perfect image.
- Do not build automated image generation or bulk prompting into the first validation cycle.
- Do not build a China mainland payment or deployment plan for the first cycle.
- Do not copy or vendor code from `mvanhorn/last30days-skill`; only reuse its research methodology.

## First Success Criteria

The preparation phase is successful when:

- The project has a repeatable research protocol for discovering current image-prompting pain points.
- Each market insight can be traced to a dated source link, user quote, or explicitly labeled assumption.
- The backlog identifies which hypotheses must be validated before writing the app.
- The governance boundaries are clear enough that future agents do not accidentally build safety-bypass features.

