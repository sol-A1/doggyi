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
prompt: `You're an expert in dog training, and a client has approached you with a ${skills} that is ${age} old and has the following behavior issues:${behavior}. 

Please provide a detailed plan for training this dog, including specific techniques, exercises, and strategies to address each behavior. 

Please write a numbered training plan that will help the owner correct the dog's behavior. Your plan should include specific techniques, exercises, and strategies to address each issue, as well as tips for reinforcing positive behavior. The owner is looking for a well-behaved, obedient, and happy dog.`,
temperature: 0,
max_tokens: 3800,
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
