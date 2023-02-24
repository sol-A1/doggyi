import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Career Path AI!',
  });
});

app.post('/', async (req, res) => {
  try {
    const skills = req.body.skills;
    const age = req.body.age;
    const behavior = req.body.behavior;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
prompt: `Your client has a ${skills} that is ${age} years old and is exhibiting the following behavior issues: ${behavior}. As an expert in dog training, please provide a step-by-step numbered training plan that addresses each issue. Your plan should include specific techniques, exercises, and strategies to correct the behavior and reinforce positive behavior. Additionally, provide tips on how to maintain the dog's good behavior in the long term.`,
temperature: 0,
max_tokens: 3500,
top_p: 1,
frequency_penalty: 0,
presence_penalty: 0,

    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5003, () =>
  console.log('Career Path AI server started on http://localhost:5003')
);
