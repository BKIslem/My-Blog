<?php

namespace App\DataFixtures;

use App\Entity\Post;
use App\Entity\User;
use App\DataFixtures\UserFixtures;
use App\Repository\UserRepository;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\String\Slugger\SluggerInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PostFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private readonly SluggerInterface $slugger,
        private UserRepository $userRepository
    )
    {
    }

    public function load(ObjectManager $manager): void
    {
        $adminUser = $this->userRepository->findOneByEmail('admin@admin.fr');
        // dd($adminUser);

        $post = new Post();
        $title = "Que signifie le mot IoT ?";
        $body = "L'Internet des objets (IoT) est la technologie qui renvoie à l'ensemble des capteurs et des objets (hors smartphones et tablettes) connectés à Internet pour informer l'utilisateur de l'état de l'appareil auxquels ils sont associés.
        Mais le concept ne se limite pas au hardware à l'appareil il comprend aussi la connectivité, qui dépend des usages pour transmettre au mieux les données, ainsi que le software pour effectuer l'analyse de ces données sur une plateforme cloud. 
        Les objets connectés sont déployés aussi bien auprès du grand public, pour permettre à l'utilisateur de gérer sa maison ou sa santé, qu'auprès des industriels pour optimiser leurs processus métier. ";
        $post->setTitle($title);
        $post->setBody($body);
        $post->setPublishedAt(new \DateTimeImmutable());
        $post->setUser($adminUser);
        $manager->persist($post);

        $post = new Post();
        $title = "coucou ?";
        $body = "re coucou";
        $post->setTitle($title);
        $post->setBody($body);
        $post->setPublishedAt(new \DateTimeImmutable());
        $post->setUser($adminUser);
        $manager->persist($post);
        
        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class,
        ];
    }
}
