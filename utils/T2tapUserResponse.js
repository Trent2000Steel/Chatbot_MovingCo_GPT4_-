import { tapUserResponse } from '../utils/tapUserResponse';

// Inside your main chat loop, after each user message:
await tapUserResponse(userMessage);
